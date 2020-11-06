/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import express, { Request, Response, NextFunction } from 'express';
import Sequelize from 'sequelize';
import db from '../index';
import { certify, contrivedDate, createColumns, isInTime } from '../utilities/helperFunctions';

const router = express.Router();
const { Op } = Sequelize;

module.exports = router;

router.get('/schedules', certify, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { churchId } = req.query;
        const schedules = await db.Schedule.findAll({ where: { churchId } });
        const searchArray = await Promise.all(schedules.map((schedule) => schedule.id));
        const searchParams = { [Op.and]: searchArray };
        const servicesData = await db.Service.findAll({ where: searchParams });

        const schedulesData = await Promise.all(
            schedules.map(
                async ({ id: scheduleId, title: scheduleTitle, view, start: scheduleStart, end: scheduleEnd }) => {
                    const eventsData = await db.Event.findAll({ where: { scheduleId } });
                    const services = await Promise.all(
                        servicesData.map(async (service) => {
                            const { name, start: startOfService, end: endOfService, day: dayOfService } = service;
                            const columns = createColumns(scheduleStart, scheduleEnd, dayOfService);

                            const returnData = [];

                            await Promise.all(
                                eventsData.map(async (event) => {
                                    const { day, order, time, title, roleId, id } = event;
                                    if (isInTime(time, startOfService, endOfService) && day === dayOfService) {
                                        const tasks = await db.Task.findAll({
                                            where: { eventId: id },
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

                                        // need to add typescript types to these data structures
                                        const serviceData: any = { duty: { data: { display: title } } };
                                        if (order === 1) serviceData.time = { data: { display: time } };
                                        tasksData.map(({ date, firstName, lastName, userId, role: taskRole }) => {
                                            const key = contrivedDate(date);
                                            const value = {
                                                data: { firstName, lastName, userId, role: taskRole },
                                            };
                                            serviceData[key] = value;
                                        });
                                        returnData.push(serviceData);
                                    }
                                }),
                            );

                            return { name, day: dayOfService, columns, data: returnData };
                        }),
                    );
                    return { services, title: scheduleTitle, view };
                },
            ),
        );
        if (!schedules) return res.status(404).send({ message: 'No schedules found' });
        return res.status(200).json(schedulesData);
    } catch (err) {
        next(err);
        return res.status(503).send({ message: 'Server error, try again later' });
    }
});
