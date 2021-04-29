/* eslint-disable no-case-declarations */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import express from 'express';

import { daysOfWeek } from '../../shared/constants';
import db from '../index';
import {
  certify,
  createColumns,
  populateServiceData,
  recurringDaysOfWeek,
} from '../utilities/helperFunctions';

const router = express.Router();

router.get('/schedules', certify, async (req, res, next) => {
  try {
    const { churchId } = req.query;
    const schedules = await db.Schedule.findAll({
      where: { churchId: churchId.toString() },
      attributes: ['id', 'title', 'view'],
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
    const columns = createColumns(schedule.start, schedule.end);
    const servicesData = await Promise.all(
      services.map(async (service) => populateServiceData(service)),
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
      start: new Date(startDate),
      end: new Date(endDate),
      churchId,
      roleId: team,
    });

    if (req.body.templateId) {
      const template = await db.Template.findOne({
        where: { id: req.body.templateId },
      });

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
            displayTime: true, // may be removed later
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

    return res.status(200).send(`Schedule ${newSchedule.title} successfully added`);
  } catch (err) {
    next(err);
    return res.status(503).send({ message: 'Server error, try again later' });
  }
});

/*  
  body can have updated, added, removed
  each will have an array of objects, handle them diffferently based on key[0]
  {taskId: 123, userId: 123}
  {eventId: 123, roleId: 123, order: 3, time: '10:15 am'}
  {serviceId: 1, name: "morning", order: 3, day: 5}
  {scheduleId: 3, title: "new main", view: "monthly"}
  should the backend have error checking to ensure the submitted items are valid?? 
  i think it'll be a lot of extra work, and the front end will be handling that already. 
  on the other hand, kinda feels risky not having validation 
*/
router.post('/schedule/update', certify, async (req, res, next) => {
  try {
    const transaction = db.sequelize.transaction(async (t) => {
      const { updated, added, removed } = req.body;

      if (updated) {
        await Promise.all(
          updated.map(async (item) => {
            const keys = Object.keys(item);

            switch (keys[0]) {
              case 'taskId':
                const targetTask = await db.Task.findOne({
                  where: { id: item.taskId },
                });
                return targetTask.update({ userId: item.userId }, { transaction: t });
              // this need more work on both ends - i'd like to eventually pass the entire event info back in one obj
              // if there are multiple changes to one event (eg. both time and duty are changed), this only needs to be run once
              case 'eventId':
                const targetEvent = await db.Event.findOne({
                  where: { id: item.eventId },
                });
                return targetEvent.update({ roleId: item.roleId }, { transaction: t });
              case 'serviceId':
                return;
              case 'scheduleId':
                return;
              default:
                break;
            }
          }),
        );
      }
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
