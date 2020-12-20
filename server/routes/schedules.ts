/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import express, { Request, Response, NextFunction } from 'express';
import db from '../index';
import {
  certify,
  createColumns,
  populateServiceData,
} from '../utilities/helperFunctions';

const router = express.Router();
module.exports = router;

router.get(
  '/schedules/tabs',
  certify,
  async (req: Request, res: Response, next: NextFunction) => {
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
  },
);

router.get(
  '/schedules',
  certify,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { scheduleId } = req.query;
      const schedule = await db.Schedule.findOne({
        where: { id: scheduleId.toString() },
      });
      const role = await db.Role.findOne({ where: { id: schedule.roleId } });
      const services = await db.Service.findAll({
        where: { scheduleId: scheduleId.toString() },
        order: [['order', 'ASC']],
      }); // toString fixes parsedQ's issue
      const columns = createColumns(schedule.start, schedule.end);

      // for each service, populate data
      const servicesData = await Promise.all(
        services.map(async (service) => await populateServiceData(service)),
      );

      const response = {
        columns: columns,
        services: servicesData,
        title: schedule.title,
        view: schedule.view,
        role: role,
      };

      if (!response) return res.status(404).send({ message: 'No schedules found' });
      return res.status(200).json(response);
    } catch (err) {
      next(err);
      return res.status(503).send({ message: 'Server error, try again later' });
    }
  },
);

router.post(
  '/schedules',
  certify,
  async (req: Request, res: Response, next: NextFunction) => {
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

      return res.status(200).send(`Schedule ${newSchedule.title} successfully added`);
    } catch (err) {
      next(err);
      return res.status(503).send({ message: 'Server error, try again later' });
    }
  },
);
