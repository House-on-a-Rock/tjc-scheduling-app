import express, { Request, Response, NextFunction } from 'express';
import Sequelize from 'sequelize';
import db from '../index';
import { certify, setDate } from '../utilities/helperFunctions';

const router = express.Router();
const { Op } = Sequelize;

module.exports = router;

router.get('/tasks', certify, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const searchArray = [];
        const { userId, churchId, roleId } = req.query;
        if (userId) searchArray.push({ userId });
        if (churchId) searchArray.push({ churchId });
        if (roleId) searchArray.push({ roleId });

        const searchParams = {
            [Op.and]: searchArray,
            // date: { [Op.gt]: new Date() },
        };
        const tasks = [];
        if (userId || roleId) {
            const userRoles = await db.UserRole.findAll({ where: searchParams });
            const query = userRoles.map(async ({ id }) => {
                const task = await db.Task.findOne({ where: { userRoleId: id } });
                tasks.push(task);
            });
            await Promise.all(query);
        }
        if (churchId) {
            const query = await db.Task.findAll({ where: searchParams });
            tasks.push(...query);
        }
        return tasks ? res.status(200).json(tasks) : res.status(404).send({ message: 'Not found' });
    } catch (err) {
        next(err);
        return res.status(503).send({ message: 'Server error, try again later' });
    }
});

router.get('/tasks/:taskId', certify, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const task = await db.Task.findOne({
            where: { id: req.params.taskId },
            attributes: ['id', 'date', 'churchId', 'userRoleId'],
        });
        return task ? res.status(200).json(task) : res.status(404).send({ message: 'Task not found' });
    } catch (err) {
        next(err);
        return res.status(503).send({ message: 'Server error, try again later' });
    }
});

router.post('/tasks', certify, async (req: Request, res: Response, next: NextFunction) => {
    try {
        // req.body could have userId + roleId, or userRoleId
        const { date, time, userRoleId, churchId, eventId } = req.body;
        const { timezone } = await db.Church.findOne({ where: { id: churchId } });
        const taskDate = setDate(date, time, timezone);
        const task = await db.Task.create({
            eventId,
            userRoleId,
            date: new Date(taskDate.toString()),
        });
        return res.status(201).send(task);
    } catch (err) {
        next(err);
        return res.status(503).send({ message: 'Server error, try again later' });
    }
});

router.delete('/tasks/:taskId', certify, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const task = await db.Task.findOne({
            where: { id: req.params.taskId },
        });
        const [message, status] = task ? ['Task deleted', 200] : ['Task not found', 404];
        if (status === 200) await task.destroy();
        return res.status(status).send({ message });
    } catch (err) {
        next(err);
        return res.status(503).send({ message: 'Server error, try again later' });
    }
});

router.patch(
    '/tasks/switchTask/:targetTaskId/switchWith/:switchTaskId',
    certify,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { targetTaskId, switchTaskId } = req.params;
            const targetTask = await db.Task.findOne({
                where: { id: targetTaskId },
                attributes: ['id', 'date', 'churchId', 'userRoleId'],
            });

            const switchTask = await db.Task.findOne({
                where: { id: switchTaskId },
                attributes: ['id', 'date', 'churchId', 'userRoleId'],
            });

            const [message, status] =
                !targetTask || !switchTask ? ['Task switch successful', 200] : ['Task not found', 404];

            if (status === 200) {
                await targetTask.update({
                    id: targetTask.id,
                    userRoleId: switchTask.userRoleId,
                });

                await switchTask.update({
                    id: switchTask.id,
                    userRoleId: targetTask.userRoleId,
                });
            }
            return res.status(status).send({ message });
        } catch (err) {
            next(err);
            return res.status(503).send({ message: 'Server error, try again later' });
        }
    },
);

router.patch(
    '/tasks/replaceTask/:taskId/replacedBy/:userRoleId',
    certify,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { taskId, userRoleId } = req.params;
            const task = await db.Task.findOne({
                where: { id: taskId },
                attributes: ['id', 'userRoleId'],
            });

            const replacingTeammate = await db.UserRole.findOne({
                where: { id: userRoleId },
                attributes: ['id'],
            });

            const askingTeammate = await db.UserRole.findOne({
                where: { id: task.userRoleId },
                attributes: ['id'],
            });

            const [message, status] =
                task && replacingTeammate && askingTeammate
                    ? ['Task replacement successful', 200]
                    : ['Task not found', 404];

            if (status === 200)
                await task.update({
                    id: task.id,
                    userRoleId: replacingTeammate.id,
                });
            return res.status(status).send({ message });
        } catch (err) {
            next(err);
            return res.status(503).send({ message: 'Server error, try again later' });
        }
    },
);
