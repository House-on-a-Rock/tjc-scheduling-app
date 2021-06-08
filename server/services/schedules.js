/* eslint-disable max-lines */
import { daysOfWeek } from '../../shared/constants';
import db from '../index';
import {
  removeTimezoneFromDate,
  weeksRange,
  replaceDashWithSlash,
  containsDate,
  formatDates,
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
};

const cellStatus = {
  SYNCED: 'synced',
  MODIFIED: 'modified',
  WARNING: 'warning',
};

export const retrieveChurchSchedules = async (churchId) =>
  db.Schedule.findAll({
    where: { churchId: churchId.toString() },
    attributes: ['id', 'title', 'view'],
    order: [['id', 'ASC']],
  });

export const retrieveOneSchedule = async (scheduleId) => {
  const schedule = await db.Schedule.findOne({
    where: { id: scheduleId.toString() },
  });
  const role = await db.Role.findOne({ where: { id: schedule.roleId } });
  const services = await db.Service.findAll({
    where: { scheduleId: scheduleId.toString() },
    order: [['order', 'ASC']],
  });
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
  const dbSchedule = await db.Schedule.findOne({
    where: { churchId, title },
    attributes: ['churchId', 'title'],
  });
  return !!dbSchedule;
};

export const createSchedule = async (request) => {
  const { title, view, startDate, endDate, churchId, team, templateId = null } = request;

  const newSchedule = await db.Schedule.create({
    title,
    view,
    start: removeTimezoneFromDate(startDate),
    end: removeTimezoneFromDate(endDate),
    churchId,
    roleId: team,
  });

  if (templateId) await constructScheduleByTemplate(newSchedule, templateId);

  return newSchedule;
};

export const deleteSchedule = async (scheduleId, title) => {
  await db.Schedule.destroy({
    where: {
      id: scheduleId,
      title,
    },
  });
};

const constructScheduleByTemplate = async (newSchedule, templateId) => {
  const template = await db.Template.findOne({
    where: { id: templateId },
  });

  // loops through each service
  template.data.forEach(async ({ name, day, events }, index) => {
    const newService = await db.Service.create({
      name: name,
      day: daysOfWeek.indexOf(day), // TODO convert this to 0-6
      order: index,
      scheduleId: newSchedule.id,
    });
    const taskDays = recurringDaysOfWeek(
      newSchedule.start,
      newSchedule.end,
      newService.day,
    );

    events.forEach(async ({ time, title: eventTitle, roleId }, order) => {
      const newEvent = await db.Event.create({
        serviceId: newService.id,
        order,
        time,
        title: eventTitle,
        roleId,
      });

      taskDays.forEach(async (date) =>
        db.Task.create({
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
        const targetService = await db.Service.findOne({
          where: { id: serviceId },
        });
        // if service day was changed, update tasks
        if (targetService.day !== day) {
          const parentSchedule = await db.Schedule.findOne({
            where: { id: service.scheduleId },
          });
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
        const newService = await db.Service.create(
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
            const targetEvent = await db.Event.findOne({
              where: { id: eventId },
            });
            return targetEvent.update(
              { time, roleId, order: eventIndex },
              { transaction: t },
            );
          } else {
            // create new events
            const newEvent = await db.Event.create(
              {
                time,
                roleId,
                serviceId: tempServiceId === null ? serviceId : tempServiceId,
                order: eventIndex,
              },
              { transaction: t },
            );
            const parentSchedule = await db.Schedule.findOne({
              where: { id: model.scheduleId },
            });
            const taskDays = recurringDaysOfWeek(
              parentSchedule.start,
              parentSchedule.end,
              day,
            );
            // create new tasks
            return Promise.all(
              taskDays.map((date) =>
                db.Task.create({ date, eventId: newEvent.id }, { transaction: t }),
              ),
            );
          }
        }),
      );
    }),
  );
}

async function updateTaskDates({ taskDays, serviceId, t }) {
  const events = await db.Event.findAll({
    where: { serviceId: serviceId },
  });
  await Promise.all(
    events.map(async (event) => {
      const tasks = await db.Task.findAll({
        where: { eventId: event.id },
        order: [['date', 'ASC']],
      });
      switch (tasks.length - taskDays.length) {
        case -1:
          if (isSameWeek(tasks[0].date, taskDays[0])) {
            await db.Task.create({
              date: taskDays[taskDays.length - 1],
              eventId: event.id,
            });
            await Promise.all(
              tasks.map(async (task, index) =>
                task.update({ date: taskDays[index] }, { transaction: t }),
              ),
            );
          } else {
            await db.Task.create({
              date: taskDays[0],
              eventId: event.id,
            });
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
      const targetTask = await db.Task.findOne({
        where: { id: item.taskId },
      });
      return targetTask.update(
        { userId: item.userId > 0 ? item.userId : null },
        { transaction: t },
      );
    }),
  );
}

async function deleteServices(Services, t) {
  await Promise.all(
    Services.map(async (item) => {
      await db.Service.destroy(
        {
          where: { id: item },
        },
        { transaction: t },
      );
    }),
  );
}

async function deleteEvents(events, t) {
  await Promise.all(
    events.map(async (item) => {
      await db.Event.destroy(
        {
          where: { id: item },
        },
        { transaction: t },
      );
    }),
  );
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
  const events = await db.Event.findAll({
    where: { serviceId: id },
    order: [['order', 'ASC']],
  }); // returns events in ascending order
  const eventData = await Promise.all(
    events.map(async (event) => {
      const { time, roleId, id: eventId, serviceId } = event;
      const userRoles = await db.UserRole.findAll({
        where: { roleId: roleId },
        attributes: ['userId'],
      });
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
  const tasks = await db.Task.findAll({
    where: { eventId },
    attributes: ['id', 'userId', 'date'],
    order: [['date', 'ASC']],
  });
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

function isSameWeek(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const weekStart = new Date(date1);
  const sevenDaysToMilliseconds = 7 * 24 * 60 * 60 * 1000;

  weekStart.setDate(d1.getDate() - d1.getDay());
  return d2 - weekStart < sevenDaysToMilliseconds && d2 - weekStart >= 0;
}
