/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import express, { Request, Response, NextFunction } from 'express';
import { ScheduleInstance } from 'shared/SequelizeTypings/models';
import db from '../index';
import {
  certify,
  createColumns,
  populateServiceData,
  recurringDaysOfWeek,
} from '../utilities/helperFunctions';
import { daysOfWeek } from '../../shared/constants';

const router = express.Router();
module.exports = router;

router.get(
  '/schedules/tabs',
  certify,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { churchId } = req.query;
      const schedules: ScheduleInstance[] = await db.Schedule.findAll({
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
      });
      const columns = createColumns(schedule.start, schedule.end);
      const servicesData = await Promise.all(
        services.map(async (service) => populateServiceData(service)),
      );

      const response = {
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
  },
);

router.post(
  '/schedules',
  certify,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // console.log('req.body', req.body);
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

      // populate with events and tasks if template
      if (req.body.templateId) {
        const template = await db.Template.findOne({
          where: { id: req.body.templateId },
        });

        template.data.forEach(async ({ name, day, events }, index) => {
          const newService = await db.Service.create({
            name: name,
            day: daysOfWeek.indexOf(day), // TODO convert this to 0-6
            order: index,
            scheduleId: newSchedule.id,
          });
          events.forEach(async ({ time, title, roleId }, index) => {
            const newEvent = await db.Event.create({
              serviceId: newService.id,
              order: index,
              time,
              title,
              roleId,
              displayTime: true, // may be mremoved later
            });
            // create unassigned tasks for the period
            const taskDays = recurringDaysOfWeek(
              newSchedule.start,
              newSchedule.end,
              newService.day,
            );
            taskDays.forEach(async (date, index) => {
              const newTask = await db.Task.create({
                date,
                eventId: newEvent.id,
              });
            });
          });
        });
      }

      return res.status(200).send(`Schedule ${newSchedule.title} successfully added`);
    } catch (err) {
      next(err);
      return res.status(503).send({ message: 'Server error, try again later' });
    }
  },
);

router.delete(
  '/schedules',
  certify,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { scheduleId, title } = req.body;
      const schedule = await db.Schedule.destroy({
        where: {
          id: scheduleId,
          title: title,
        },
        attributes: ['title'],
      });
      return res.status(200).send(`Schedule ${title} successfully deleted`);
    } catch (err) {
      next(err);
      return res.status(503).send({ message: 'Server error, try again later' });
    }
  },
);
