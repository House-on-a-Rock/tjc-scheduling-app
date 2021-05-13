import express from 'express';

import { daysOfWeek } from '../../shared/constants';
import db from '../index';
import {
  certify,
  createColumns,
  deleteEvents,
  deleteServices,
  populateServiceData,
  recurringDaysOfWeek,
  removeTimezoneFromDate,
  updateEvents,
  updateServices,
  updateTasks,
  weeksRange,
} from '../utilities/helperFunctions';

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
