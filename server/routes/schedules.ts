/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import express, { Request, Response, NextFunction } from 'express';
import db from '../index';
import { certify, contrivedDate, createColumns } from '../utilities/helperFunctions';

const router = express.Router();
module.exports = router;

router.get('/schedules/tabs', certify, async (req: Request, res: Response, next: NextFunction) => {
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

router.get('/schedules', certify, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { scheduleId } = req.query;
        const schedule = await db.Schedule.findOne({ where: { id: scheduleId.toString() } });
        const scheduleRole = await db.Role.findOne({ where: { id: schedule.roleId } });
        const services = await db.Service.findAll({ where: { scheduleId: scheduleId.toString() } }); //toString fixes parsedQ's issue
        const servicesData = await Promise.all(
            services.map(async (service) => {
                const events = await db.Event.findAll({ where: { serviceId: service.id } });
                const columns = createColumns(schedule.start, schedule.end, service.day);
                const data = await Promise.all(
                    events.map(async (event) => {
                        const { time, title, roleId, displayTime, id: eventId } = event;

                        const tasks = await db.Task.findAll({ where: { eventId } });
                        const role = await db.Role.findOne({
                            where: { id: roleId },
                            attributes: ['id', 'name'],
                        });
                        const tasksData = await Promise.all(
                            tasks.map(async ({ date, userId }) => {
                                const { firstName, lastName } = await db.User.findOne({
                                    where: { id: userId },
                                });
                                return { date, firstName, lastName, userId, role };
                            }),
                        );
                        const serviceData: any = { duty: { data: { display: title } } };

                        if (displayTime) serviceData.time = { data: { display: time } };

                        tasksData.map((task) => {
                            const { date, firstName, lastName, userId, role: taskRole } = task;
                            const key = contrivedDate(date);
                            const value = {
                                data: { firstName, lastName, userId, role: taskRole },
                            };
                            serviceData[key] = value;
                        });
                        return serviceData;
                    }),
                );

                return { columns: columns, name: service.name, day: service.day, data: data };
            }),
        );
        const response = { services: servicesData, title: schedule.title, view: schedule.view, role: scheduleRole };

        if (!response) return res.status(404).send({ message: 'No schedules found' });
        return res.status(200).json(response);
    } catch (err) {
        next(err);
        return res.status(503).send({ message: 'Server error, try again later' });
    }
});

router.post('/schedules', certify, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, view, startDate, endDate, churchId, team } = req.body; //roleId still team on webapp
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

        // return res.status(200).json(newSchedule);
        return res.status(200).send(`Schedule ${newSchedule.title} successfully added`);
    } catch (err) {
        next(err);
        return res.status(503).send({ message: 'Server error, try again later' });
    }
});
