/* eslint-disable consistent-return */
import express from 'express';

import { findAllChurchSchedules, destroySchedule } from '../dataAccess/schedules';
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
    if (!response) return next({ status: 404, message: 'No schedule found' });
    return res.status(200).json(response);
  } catch (err) {
    next(err);
    return res.status(503).send({ message: 'Server error, try again later' });
  }
});

router.post('/schedule', certify, async (req, res, next) => {
  try {
    const { churchId, title } = req.body;
    if (await doesScheduleExist(churchId, title))
      return next({ status: 409, message: 'Schedule already exists' });

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
    // this doesnt actually retrieve an updated schedule... will fully implement once i figure it out
    // im awaiting the update right, idk why im retrieving outdated schedule
    const updatedSchedule = await retrieveOneSchedule(changes.scheduleId);
    return res
      .status(200)
      .json({ message: `Schedule updated successfully!`, data: updatedSchedule });
  } catch (err) {
    return next({ status: 409, message: 'error updating schedule' });
  }
});

router.delete('/schedule', certify, async (req, res, next) => {
  try {
    const { scheduleId, title, churchId } = req.body;
    await destroySchedule(scheduleId, title);
    const schedules = await findAllChurchSchedules(churchId);

    return res
      .status(200)
      .json({ message: `Schedule ${title} successfully deleted`, data: schedules });
  } catch (err) {
    return next({ status: 503, message: 'Server error, please try again later' });
  }
});

export default router;
