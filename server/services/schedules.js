/* eslint-disable max-lines */
import { daysOfWeek } from '../../shared/constants';
import {
  createNewEvent,
  createNewSchedule,
  createNewService,
  createNewTask,
  findAllEvents,
  findAllServices,
  findAllTasks,
  findAllUserRole,
  findOneEvent,
  findOneRole,
  findOneSchedule,
  findOneService,
  findOneTask,
  findOneTemplate,
  findScheduleByTitle,
  deleteOneService,
  deleteOneEvent,
} from '../dataAccess/schedules';
import db from '../index';
import {
  removeTimezoneFromDate,
  weeksRange,
  replaceDashWithSlash,
  containsDate,
  formatDates,
  isSameWeek,
} from '../utilities/helperFunctions';

/*
  should the backend have error checking to ensure the submitted items are valid??
  i think it'll be a lot of extra work, and the front end will be handling that already.
  on the other hand, kinda feels risky not having validation
*/

const updateRouter = {
  tasks: updateTasks,
  deletedServices: deleteServices,
  deletedEvents: deleteEvents,
  dataModel: updateModel,
  scheduleId: () => {},
};

const cellStatus = {
  SYNCED: 'synced',
  MODIFIED: 'modified',
  WARNING: 'warning',
};

export const retrieveOneSchedule = async (scheduleId) => {
  const schedule = await findOneSchedule(scheduleId);
  const role = await findOneRole(schedule.roleId);
  const services = await findAllServices(scheduleId);
  const start = removeTimezoneFromDate(schedule.start);
  const end = removeTimezoneFromDate(schedule.end);

  const weekRange = weeksRange(start, end);
  const columns = createColumns(weekRange);
  const servicesData = await Promise.all(
    services.map(async (service) => populateServiceData(service, scheduleId, weekRange)),
  );
  return {
    scheduleId,
    columns,
    services: servicesData,
    title: schedule.title,
    view: schedule.view,
    role,
  };
};

export const doesScheduleExist = async (churchId, title) => {
  const dbSchedule = await findScheduleByTitle(churchId, title);
  return !!dbSchedule;
};

// TODO go with either roleId or team in both front and backend...
export const createSchedule = async (request) => {
  const { startDate, endDate, team, templateId = null } = request;
  const newScheduleProps = {
    ...request,
    start: removeTimezoneFromDate(startDate),
    end: removeTimezoneFromDate(endDate),
    roleId: team,
  };
  const newSchedule = await createNewSchedule(newScheduleProps);
  if (templateId) await constructScheduleByTemplate(newSchedule, templateId);
  return newSchedule;
};

const constructScheduleByTemplate = async (newSchedule, templateId) => {
  const template = await findOneTemplate(templateId);

  template.data.forEach(async ({ name, day, events }, index) => {
    const newService = await createNewService({
      name,
      day,
      order: index,
      scheduleId: newSchedule.id,
    });
    const taskDays = recurringDaysOfWeek(
      newSchedule.start,
      newSchedule.end,
      newService.day,
    );

    events.forEach(async (event, order) => {
      const newEvent = await createNewEvent({
        ...event,
        serviceId: newService.id,
        order,
      });

      taskDays.forEach(async (date) =>
        createNewTask({
          date,
          eventId: newEvent.id,
        }),
      );
    });
  });
};

export const updateSchedule = async (changes) => {
  // eslint-disable-next-line no-unused-vars
  const sequelizeTransaction = db.sequelize.transaction(async (transaction) => {
    await Promise.all(
      Object.keys(changes).map(async (type) => {
        return updateRouter[type](changes[type], transaction);
      }),
    );
  });
};

async function updateModel(model, t) {
  await Promise.all(
    model.dataModel.map(async (service, serviceIndex) => {
      const { name, day, serviceId } = service;
      let tempServiceId = null;
      if (serviceId >= 0) {
        // service exists, update
        const targetService = await findOneService(serviceId);
        // if service day was changed, update tasks
        if (targetService.day !== day) {
          const parentSchedule = await findOneSchedule(service.scheduleId);
          const taskDays = recurringDaysOfWeek(
            parentSchedule.start,
            parentSchedule.end,
            day,
          );
          await updateTaskDates({ taskDays, serviceId, t });
        }
        targetService.update(
          { name: name, day: day, order: serviceIndex },
          { transaction: t },
        );
      } else {
        // service doesn't exist, create
        const newService = await createNewService(
          { name: name, day: day, scheduleId: model.scheduleId, order: serviceIndex },
          { transaction: t },
        );
        tempServiceId = newService.id;
      }
      await Promise.all(
        service.events.map(async (event, eventIndex) => {
          const { eventId, time, roleId } = event;
          // if eventId is not negative, update existing events
          if (eventId >= 0) {
            const targetEvent = await findOneEvent(eventId);
            return targetEvent.update(
              { time, roleId, order: eventIndex },
              { transaction: t },
            );
          } else {
            // else create new events
            const newEvent = await createNewEvent(
              {
                time,
                roleId,
                serviceId: tempServiceId === null ? serviceId : tempServiceId,
                order: eventIndex,
              },
              { transaction: t },
            );
            const parentSchedule = await findOneSchedule(model.scheduleId);
            const taskDays = recurringDaysOfWeek(
              parentSchedule.start,
              parentSchedule.end,
              day,
            );
            // create new tasks
            return Promise.all(
              taskDays.map((date) =>
                createNewTask({ date, eventId: newEvent.id }, { transaction: t }),
              ),
            );
          }
        }),
      );
    }),
  );
}

async function updateTaskDates({ taskDays, serviceId, t }) {
  const events = await findAllEvents(serviceId);
  await Promise.all(
    events.map(async (event) => {
      const tasks = await findAllTasks(event.id);
      switch (tasks.length - taskDays.length) {
        case -1:
          if (isSameWeek(tasks[0].date, taskDays[0])) {
            await createNewTask(
              { date: taskDays[taskDays.length - 1], eventId: event.id },
              { transaction: t },
            );
            await Promise.all(
              tasks.map(async (task, index) =>
                task.update({ date: taskDays[index] }, { transaction: t }),
              ),
            );
          } else {
            await createNewTask(
              { date: taskDays[0], eventId: event.id },
              { transaction: t },
            );
            await Promise.all(
              tasks.map(async (task, index) =>
                task.update({ date: taskDays[index + 1] }, { transaction: t }),
              ),
            );
          }
          break;
        case 1:
          if (isSameWeek(tasks[0].date, taskDays[0])) {
            await tasks[tasks.length - 1].destroy();
            await Promise.all(
              tasks.map(async (task, index) =>
                task.update({ date: taskDays[index] }, { transaction: t }),
              ),
            );
          } else {
            await Promise.all(
              taskDays.map(async (taskDay, index) => {
                tasks[index + 1].update({ date: taskDay }, { transaction: t });
              }),
            );
            await tasks[0].destroy();
          }
          break;
        default:
          await Promise.all(
            tasks.map(async (task, index) =>
              task.update({ date: taskDays[index] }, { transaction: t }),
            ),
          );
          break;
      }
    }),
  );
}

async function updateTasks(tasks, t) {
  await Promise.all(
    tasks.map(async (item) => {
      const targetTask = await findOneTask(item.taskId);
      return targetTask.update(
        { userId: item.userId > 0 ? item.userId : null },
        { transaction: t },
      );
    }),
  );
}

async function deleteServices(services, t) {
  await Promise.all(services.map(async (serviceId) => deleteOneService(serviceId, t)));
}

async function deleteEvents(events, t) {
  await Promise.all(events.map(async (eventId) => deleteOneEvent(eventId, t)));
}

// returns the date of every day (eg. [5/6/2020, 5/14/2020 ] is every monday or tues) within the range
function recurringDaysOfWeek(startDate, endDate, dayOfWeeK) {
  const [start, end] = [
    replaceDashWithSlash(startDate),
    new Date(replaceDashWithSlash(endDate)),
  ];
  const weeks = [];
  const startDayOfWeek = new Date(start).getDay();
  let dayModifier = dayOfWeeK - startDayOfWeek;
  if (dayModifier < 0) dayModifier += 7;
  let current = new Date(start);

  current.setDate(current.getDate() + dayModifier);
  while (current <= end) {
    weeks.push(new Date(current));
    current = new Date(current.setDate(current.getDate() + 7));
  }
  return weeks;
}

async function populateServiceData(service, scheduleId, weekRange) {
  const { name, day, id } = service;
  const events = await findAllEvents(id); // returns events in ascending order
  const eventData = await Promise.all(
    events.map(async (event) => {
      const { time, roleId, id: eventId, serviceId } = event;
      const userRoles = await findAllUserRole(roleId);
      const userIds = userRoles.map((userRole) => userRole.userId);
      const tasks = await retrieveTaskData(
        eventId,
        weekRange[0],
        weekRange[weekRange.length - 1],
        userIds,
      );
      return {
        time,
        roleId,
        eventId,
        cells: [{}, {}, ...tasks],
        serviceId,
      };
    }),
  );
  return {
    name,
    day,
    events: eventData,
    serviceId: id,
    scheduleId: parseInt(scheduleId),
  };
}

async function retrieveTaskData(eventId, firstWeek, lastWeek, userIds) {
  const tasks = await findAllTasks(eventId);
  const organizedTasks = tasks.map((task) => {
    // checks if userId belongs to list of users with that role.
    const doesRoleMatch = userIds.indexOf(task.userId);
    return {
      taskId: task.id,
      userId: task.userId,
      date: task.date,
      // if role does not match, cell will receive 'warning' status and will appear red in frontend
      status:
        doesRoleMatch >= 0 || task.userId === null
          ? cellStatus.SYNCED
          : cellStatus.WARNING,
    };
  });
  // adds a spacer cell for when a service does not exist on that date
  if (tasks.length > 0) {
    if (!containsDate(firstWeek, tasks[0].date))
      organizedTasks.unshift({ taskId: null, userId: null });
    if (!containsDate(lastWeek, tasks[tasks.length - 1].date))
      organizedTasks.push({ taskId: null, userId: null });
  } else {
    organizedTasks.push({ taskId: null, userId: null });
  }
  return organizedTasks;
}

function createColumns(weekRange) {
  return [
    { Header: '' },
    { Header: 'Time' },
    { Header: 'Duty' },
    ...formatDates(weekRange),
  ];
}
