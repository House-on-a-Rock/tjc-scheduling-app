/* eslint-disable no-case-declarations */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
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
  replaceDashWithSlash,
  updateEvents,
  updateServices,
  updateTasks,
  weeksRange,
} from '../utilities/helperFunctions';

const router = express.Router();

router.get('/schedules', certify, async (req, res, next) => {
  try {
    const { churchId } = req.query;
    const schedules = await db.Schedule.findAll({
      where: { churchId: churchId.toString() },
      attributes: ['id', 'title', 'view'],
      order: [['id', 'ASC']],
    });
    return res.status(200).json(schedules);
  } catch (err) {
    next(err);
    return res.status(503).send({ message: 'Server error, try again later' });
  }
});

router.get('/schedule', certify, async (req, res, next) => {
  try {
    const { scheduleId } = req.query;
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
      services.map(async (service) =>
        populateServiceData(service, scheduleId, weekRange),
      ),
    );

    const response = {
      scheduleId,
      columns,
      services: servicesData,
      title: schedule.title,
      view: schedule.view,
      role,
    };
    if (!response) return res.status(404).send({ message: 'No schedules found' });
    return res.status(200).json(response);
  } catch (err) {
    next(err);
    return res.status(503).send({ message: 'Server error, try again later' });
  }
});

router.post('/schedule', certify, async (req, res, next) => {
  try {
    const { title, view, startDate, endDate, churchId, team } = req.body; // roleId still team on webapp
    const dbSchedule = await db.Schedule.findOne({
      where: { churchId, title },
      attributes: ['churchId', 'title'],
    });

    if (dbSchedule) {
      res.statusMessage = 'Schedule already exists';
      res.status(409).send();
      return;
    }

    const newSchedule = await db.Schedule.create({
      title,
      view,
      start: removeTimezoneFromDate(startDate),
      end: removeTimezoneFromDate(endDate),
      churchId,
      roleId: team,
    });

    if (req.body.templateId) {
      const template = await db.Template.findOne({
        where: { id: req.body.templateId },
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
    }
    // fetch tabs for return so it saves an api call
    const schedules = await db.Schedule.findAll({
      where: { churchId: churchId.toString() },
      attributes: ['id', 'title', 'view'],
      order: [['id', 'ASC']],
    });

    return res.status(200).json({
      data: schedules,
      message: `Schedule ${newSchedule.title} created successfully`,
    });
  } catch (err) {
    next(err);
    return res.status(503).send({ message: 'Server error, try again later' });
  }
});

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

router.post('/schedule/update', certify, async (req, res, next) => {
  const changes = req.body;
  try {
    // eslint-disable-next-line no-unused-vars
    const sequelizeTransaction = db.sequelize.transaction(async (transaction) => {
      await Promise.all(
        Object.keys(changes).map(async (type) => {
          return updateRouter[type](changes[type], transaction);
        }),
      );
    });
    return res.status(200).send(`Schedule updated successfully!`);
  } catch (err) {
    next(err);
    return res.status(503).send({ message: 'Server error, try again later' });
  }
});

router.delete('/schedule', certify, async (req, res, next) => {
  try {
    const { scheduleId, title } = req.body;
    await db.Schedule.destroy({
      where: {
        id: scheduleId,
        title,
      },
    });
    return res.status(200).send(`Schedule ${title} successfully deleted`);
  } catch (err) {
    next(err);
    return res.status(503).send({ message: 'Server error, try again later' });
  }
});
export default router;
