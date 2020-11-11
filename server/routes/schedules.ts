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
                                        // if
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
                return { services: servicesData, title: schedule.title, view: schedule.view };
            }),
        );

        if (!scheduleData) return res.status(404).send({ message: 'No schedules found' });
        return res.status(200).json(scheduleData);
    } catch (err) {
        next(err);
        return res.status(503).send({ message: 'Server error, try again later' });
    }
});
