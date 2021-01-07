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
  '/schedules',
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

// router.get(
//   '/schedules',
//   certify,
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { churchId } = req.query;
//       console.log('210938471092378401928374', typeof churchId, churchId);
//       const schedules: ScheduleInstance[] = await db.Schedule.findAll({
//         where: { churchId: churchId.toString() },
//       });
//       const roles = await db.Role.findAll({
//         where: { [Sequelize.Op.or]: schedules.map((schedule) => schedule.roleId) },
//       });

//       const allServicesInAllSchedules: ServiceInstance[][] = await Promise.all(
//         schedules.map(async (schedule) => {
//           console.log('@#$@#$', typeof schedule.id, schedule.id);
//           const servicesData: ServiceInstance[] = await db.Service.findAll({
//             where: { scheduleId: schedule.id },
//             order: [['order', 'ASC']],
//           });
//           return servicesData;
//         }),
//       );
//       // return res.json(services);
//       const columns = schedules.map((schedule) =>
//         createColumns(schedule.start, schedule.end),
//       );

//       // const schedule = await db.Schedule.findOne({
//       //   where: { id: scheduleId.toString() },
//       // });
//       // const role = await db.Role.findOne({ where: { id: schedule.roleId } });
//       // const services = await db.Service.findAll({
//       //   where: { scheduleId: scheduleId.toString() },
//       //   order: [['order', 'ASC']],
//       // });
//       // const columns = createColumns(schedule.start, schedule.end);
//       const servicesData = await Promise.all(
//         allServicesInAllSchedules.map((services) =>
//           services.map((service) => populateServiceData(service)),
//         ),
//       );

//       // const response = {
//       //   columns,
//       //   services: servicesData,
//       //   title: schedule.title,
//       //   view: schedule.view,
//       //   role,
//       // };
//       // if (!response) return res.status(404).send({ message: 'No schedules found' });
//       return res.status(200).json(servicesData);
//     } catch (err) {
//       next(err);
//       return res.status(503).send({ message: 'Server error, try again later' });
//     }
//   },
// );

router.get(
  '/schedule',
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
      // what is this for?
      // const events = await db.Event.findAll({
      //   where: { scheduleId: schedule.id },
      // });

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
  },
);

router.post(
  '/schedule',
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
          events.forEach(async ({ time, title: eventTitle, roleId }, order) => {
            const newEvent = await db.Event.create({
              serviceId: newService.id,
              order,
              time,
              title: eventTitle,
              roleId,
              displayTime: true, // may be removed later
            });
            const taskDays: Date[] = recurringDaysOfWeek(
              newSchedule.start,
              newSchedule.end,
              newService.day,
            );
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
  },
);

router.delete(
  '/schedule',
  certify,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { scheduleId, title } = req.body;
      await db.Schedule.destroy({
        where: {
          id: scheduleId,
          title: title,
        },
      });
      return res.status(200).send(`Schedule ${title} successfully deleted`);
    } catch (err) {
      next(err);
      return res.status(503).send({ message: 'Server error, try again later' });
    }
  },
);
