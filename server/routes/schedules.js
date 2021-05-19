/* eslint-disable consistent-return */
import express from 'express';

import { findAllChurchSchedules, destroySchedule } from '../services/dataAccess';
import {
  createSchedule,
  doesScheduleExist,
  retrieveOneSchedule,
  updateSchedule,
} from '../services/schedules';
import { certify } from '../utilities/helperFunctions';

const router = express.Router();

router.get('/schedules', certify, async (req, res, next) => {
  try {
    const { churchId } = req.query;
    const schedules = await findAllChurchSchedules(churchId);
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
      // TODO clean up and make consistent responses
      res.statusMessage = 'Schedule already exists';
      res.status(409).send();
      return;
    }
    const newSchedule = await createSchedule(req.body);
    const schedules = await findAllChurchSchedules(churchId);

    return res.status(200).json({
      data: schedules,
      message: `Schedule ${newSchedule.title} created successfully`,
    });
  } catch (err) {
    next(err);
    return res.status(503).json({ message: 'Server error, try again later' });
  }
});

// should this route be renamed?
router.post('/schedule/update', certify, async (req, res, next) => {
  const changes = req.body;
  try {
    await updateSchedule(changes);
    return res.status(200).send(`Schedule updated successfully!`);
  } catch (err) {
    next(err);

    return res.status(503).send({ message: 'Server error, try again later' });
  }
});

router.delete('/schedule', certify, async (req, res, next) => {
  try {
    const { scheduleId, title } = req.body;
    await destroySchedule(scheduleId, title);
    return res.status(200).send(`Schedule ${title} successfully deleted`);
  } catch (err) {
    next(err);
    return res.status(503).send({ message: 'Server error, try again later' });
  }
});

export default router;
