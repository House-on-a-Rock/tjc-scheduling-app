/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import express, { Request, Response, NextFunction } from 'express';
import Sequelize from 'sequelize';
import db from '../index';
import { certify, correctOrder, isInTime } from '../utilities/helperFunctions';

const router = express.Router();
const { Op } = Sequelize;

module.exports = router;

router.get('/schedules', certify, async (req: Request, res: Response, next: NextFunction) => {
    try {
        // query dependent on date
        const { churchId } = req.query;

        const schedules = await db.Schedule.findAll({ where: { churchId } });
        // Schedule is the overarching model of all tasks/events/services
        // Schedule includes all services that a user wants displayed on one page (schedule)

        // Uses Schedule id to find associated dividers
        const searchArray = await Promise.all(schedules.map((schedule) => schedule.id));
        const searchParams = { [Op.and]: searchArray };
        const dividers = await db.Divider.findAll({ where: searchParams });
        // While all tasks fall under the Schedule umbrella, it can be further organized into servcies (ex. Morning service, Afternoon service, Friday service)
        // Dividers serve to divide the tasks into appropriate services

        const schedulesData = await Promise.all(
            schedules.map(
                async ({ id: scheduleId, title: scheduleTitle, view, start: scheduleStart, end: scheduleEnd }) => {
                    /* Services is the template for how the schedule should look
                        {
                            "id": 1,
                            "name": "Morning Service",
                            "order": 1,
                            "start": "10:15 AM",
                            "end": "12:30 PM",
                            "events": [],
                            "day": "Saturday"
                        }, ...
                    */
                    const services = dividers.map(({ id, name, order, start: dividerStart, end: dividerEnd }) => {
                        return { id, name, order, start: dividerStart, end: dividerEnd, events: [], day: '' };
                    });
                    const events = await db.Event.findAll({ where: { scheduleId } });

                    await Promise.all(
                        events.map(async ({ id, day: eventDay, order, time: eventTime, title }) => {
                            const tasks = await db.Task.findAll({
                                where: { eventId: id },
                                include: [{ model: db.UserRole, as: 'userRole' }],
                            });
                            // TasksData is a complete version of tasks (requires assignee)
                            const tasksData = await Promise.all(
                                tasks.map(async ({ date, userRole, status }) => {
                                    const { firstName, lastName } = await db.User.findOne({
                                        where: { id: userRole.userId },
                                    });
                                    return { date, assignee: { firstName, lastName }, status };
                                }),
                            );
                            // Compares the task's time (given by event) and attaches into services template
                            services.map((service) => {
                                const { start, end, events: serviceEvents } = service;
                                if (isInTime(eventTime, start, end)) {
                                    // Event belongs to service
                                    if (!service.day) service.day = eventDay;

                                    // If eventTime is between scheduleStart and scheduleEnd, then it belongs in this current service
                                    const allEventTimes = serviceEvents.map(({ time }) => time);
                                    // Consolidate tasks by time similar to memoizing
                                    // AllEventTimes records the times available
                                    if (!allEventTimes.includes(eventTime)) {
                                        // If memo doens't contain time, add a new time, but time isn't always right...
                                        const newEvents = {
                                            time: eventTime,
                                            duties: [{ tasks: tasksData, order, title }],
                                        };
                                        service.events = correctOrder(
                                            serviceEvents,
                                            serviceEvents.length - 1,
                                            newEvents,
                                            'time',
                                        );
                                    }
                                    // If memo does contain time, update with new duties
                                    else
                                        serviceEvents.map(({ time, duties }) => {
                                            const newDuties = { tasks: tasksData, order, title };
                                            if (time === eventTime) {
                                                // Order isn't always right..
                                                if (duties[duties.length - 1].order > order)
                                                    duties = correctOrder(
                                                        duties,
                                                        duties.length - 1,
                                                        newDuties,
                                                        'order',
                                                    );
                                                else duties.push(newDuties);
                                            }
                                        });
                                }
                            });
                        }),
                    );
                    return { services, title: scheduleTitle, view, start: scheduleStart, end: scheduleEnd };
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
