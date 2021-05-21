import db from '../index';

// TODO passing in transactions -- likely necessary for create and delete

// create
export const createNewSchedule = async (scheduleProps) =>
  db.Schedule.create(scheduleProps);

export const createNewService = async (serviceProps, transaction) =>
  db.Service.create(serviceProps, transaction);

export const createNewEvent = async (eventProps, transaction) =>
  db.Event.create(eventProps, transaction);

export const createNewTask = async (taskProps, transaction) =>
  db.Task.create(taskProps, transaction);

// Find/Read functions - does not need transactions

export const findAllChurchSchedules = async (churchId) =>
  db.Schedule.findAll({
    where: { churchId: churchId.toString() },
    attributes: ['id', 'title', 'view'],
    order: [['id', 'ASC']],
  });

export const findOneSchedule = async (scheduleId) =>
  db.Schedule.findOne({
    where: { id: scheduleId.toString() },
  });

export const findScheduleByTitle = async (churchId, title) =>
  db.Schedule.findOne({
    where: { churchId, title },
  });

export const findOneRole = async (roleId) => db.Role.findOne({ where: { id: roleId } });

export const findAllUserRole = async (roleId) =>
  db.UserRole.findAll({
    where: { roleId },
    attributes: ['userId'],
  });

export const findAllServices = async (scheduleId) =>
  db.Service.findAll({
    where: { scheduleId: scheduleId.toString() },
    order: [['order', 'ASC']],
  });

export const findOneService = async (serviceId) =>
  db.Service.findOne({ where: { id: serviceId } });

export const findOneEvent = async (eventId) =>
  db.Event.findOne({ where: { id: eventId } });

export const findAllEvents = async (serviceId) =>
  db.Event.findAll({
    where: { serviceId },
    order: [['order', 'ASC']],
  });

export const findOneTemplate = async (templateId) =>
  db.Template.findOne({
    where: { id: templateId },
  });

export const findAllTasks = async (eventId) =>
  db.Task.findAll({
    where: { eventId },
    attributes: ['id', 'userId', 'date'],
    order: [['date', 'ASC']],
  });

export const findOneTask = async (taskId) =>
  db.Task.findOne({
    where: { id: taskId },
  });

// update - are generally methods called on the instance

// delete
export const destroySchedule = async (scheduleId, title) =>
  db.Schedule.destroy({
    where: {
      id: scheduleId,
      title,
    },
  });

export const deleteOneService = async (serviceId, t) =>
  db.Service.destroy({ where: { id: serviceId } }, { transaction: t });

export const deleteOneEvent = async (eventId, t) =>
  db.Event.destroy({ where: { id: eventId } }, { transaction: t });
