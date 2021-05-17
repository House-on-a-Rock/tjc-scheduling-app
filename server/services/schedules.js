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
  services: updateServices,
  events: updateEvents,
  deletedServices: deleteServices,
  deletedEvents: deleteEvents,
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
      order: index, // should it be zero based or 1 based? currently, others are 1 based
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

      taskDays.forEach((date) =>
        db.Task.create({
          date,
          eventId: newEvent.id,
        }),
      );
    });
  });
};

async function updateEvents(events, t) {
  await Promise.all(
    events.map(async (item, index) => {
      const { eventId, time, roleId, serviceId } = item;
      const targetEvent = await db.Event.findOne({
        where: { id: eventId },
      });

      if (targetEvent)
        // if event already exists, update to match incoming data
        return targetEvent.update({ time, roleId, order: index }, { transaction: t });
      else {
        // else create new event, and corresponding tasks
        const newEvent = await db.Event.create(
          { time, roleId, serviceId, order: index },
          { transaction: t },
        );
        const parentService = await db.Service.findOne({
          where: { id: serviceId },
        });
        const parentSchedule = await db.Schedule.findOne({
          where: { id: parentService.scheduleId },
        });
        const taskDays = recurringDaysOfWeek(
          parentSchedule.start,
          parentSchedule.end,
          parentService.day,
        );
        taskDays.forEach((date) =>
          db.Task.create({ date, eventId: newEvent.id }, { transaction: t }),
        );
        return newEvent;
      }
    }),
  );
}

async function updateServices(services, t) {
  await Promise.all(
    services.map(async (item, index) => {
      const { name, day, scheduleId, serviceId } = item;
      if (serviceId) {
        const targetService = await db.Service.findOne({
          where: { id: serviceId },
        });
        return targetService.update(
          { name: name, day: day, order: index },
          { transaction: t },
        );
      } else {
        return db.Service.create(
          { name: name, day: day, scheduleId: scheduleId, order: index },
          { transaction: t },
        );
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

// returns the date of every day (eg. monday or tues) within the range
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
      // if role does not match, cell will receive 'warning' status and will appear red in frontend
      status:
        doesRoleMatch >= 0 || task.userId === null
          ? cellStatus.SYNCED
          : cellStatus.WARNING,
    };
  });
  // adds a spacer cell for when a service does not exist on that date
  if (!containsDate(firstWeek, tasks[0].date))
    organizedTasks.unshift({ taskId: null, userId: null });
  if (!containsDate(lastWeek, tasks[tasks.length - 1].date))
    organizedTasks.push({ taskId: null, userId: null });
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
