/* eslint-disable no-case-declarations */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import express from 'express';

import { daysOfWeek } from '../../shared/constants';
import db from '../index';
import {
  createSchedule,
  doesScheduleExist,
  retrieveChurchSchedules,
  retrieveOneSchedule,
} from '../services/schedules';
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

const router = express.Router();

router.get('/schedules', certify, async (req, res, next) => {
  try {
    const { churchId } = req.query;
    const schedules = await retrieveChurchSchedules(churchId);
    return res.status(200).json(schedules);
  } catch (err) {
    next(err);
    return res.status(503).send({ message: 'Server error, try again later' });
  }
});

router.get('/schedule', certify, async (req, res, next) => {
  try {
    const { scheduleId } = req.query;
    const response = await retrieveOneSchedule(scheduleId);
    if (!response) return res.status(404).send({ message: 'No schedules found' });
    return res.status(200).json(response);
  } catch (err) {
    next(err);
    return res.status(503).send({ message: 'Server error, try again later' });
  }
});

router.post('/schedule', certify, async (req, res, next) => {
  try {
    const { churchId, title } = req.body;
    if (await doesScheduleExist(churchId, title)) {
      // TODO clean up all responses
      res.statusMessage = 'Schedule already exists';
      res.status(409).send();
      return;
    }
    const newSchedule = await createSchedule(req.body);
    const schedules = await retrieveChurchSchedules(churchId);

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

// should this route be renamed?
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
