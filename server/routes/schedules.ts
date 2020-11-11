/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import express, { Request, Response, NextFunction } from 'express';
// import Sequelize from 'sequelize';
import db from '../index';
import { certify, contrivedDate, createColumns } from '../utilities/helperFunctions';

const router = express.Router();
// const { Op } = Sequelize;

module.exports = router;

router.get('/schedules', certify, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { churchId } = req.query;
        const schedules = await db.Schedule.findAll({ where: { churchId: churchId.toString() } });

        const scheduleData = await Promise.all(
            schedules.map(async (schedule) => {
                const services = await db.Service.findAll({ where: { scheduleId: schedule.id } });
                const sData = await Promise.all(
                    services.map(async (service) => {
                        const events = await db.Event.findAll({ where: { serviceId: service.id } });
                        const columns = createColumns(schedule.start, schedule.end, service.day);
                        const data = await Promise.all(
                            events.map(async (event) => {
                                const { time, title, roleId, displayTime, id: eventId } = event;

                                const tasks = await db.Task.findAll({
                                    where: { eventId },
                                    include: [{ model: db.UserRole, as: 'userRole' }],
                                });
                                const role = await db.Role.findOne({
                                    where: { id: roleId },
                                    attributes: ['id', 'name'],
                                });
                                const tasksData = await Promise.all(
                                    tasks.map(async ({ date, userRole }) => {
                                        const { firstName, lastName, id: userId } = await db.User.findOne({
                                            where: { id: userRole.userId },
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
                return { services: sData, title: schedule.title, view: schedule.view };
            }),
        );

        if (!scheduleData) return res.status(404).send({ message: 'No schedules found' });
        return res.status(200).json(scheduleData);
    } catch (err) {
        next(err);
        return res.status(503).send({ message: 'Server error, try again later' });
    }
});

router.post('/schedules', certify, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, view, startDate, endDate, churchId, team } = req.body;
        const dbSchedule = await db.Schedule.findOne({
            where: { churchId, title },
            attributes: ['churchId', 'title'],
        });

        if (dbSchedule) return res.status(409).send({ message: 'Schedule already exists' });

        const newSchedule = await db.Schedule.create({
            title,
            view,
            start: new Date(startDate),
            end: new Date(endDate),
            churchId,
            team,
        });

        return res.status(200).json(newSchedule);
    } catch (err) {
        next(err);
        return res.status(503).send({ message: 'Server error, try again later' });
    }
});

router.post('/schedules/services', certify, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, order, dayOfWeek, scheduleId } = req.body;
        const dbService = await db.Service.findOne({
            where: {
                name,
                scheduleId,
            },
        });
        console.log('dbService', dbService);

        if (dbService) return res.status(409).send({ message: 'Service already exists' });

        const newService = await db.Service.create({
            name,
            order,
            day: dayOfWeek,
            scheduleId: scheduleId,
        });

        return res.status(200).json(newService);
    } catch (err) {
        next(err);
        return res.status(503).send({ message: 'Server error, try again later' });
    }
});
