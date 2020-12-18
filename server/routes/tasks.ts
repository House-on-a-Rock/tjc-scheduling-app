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
        // is going to need more information like date, time --> events
        if (userId) searchArray.push({ userId });
        if (churchId) searchArray.push({ churchId });
        if (roleId) searchArray.push({ roleId });

        const searchParams = {
            [Op.and]: searchArray,
            // date: { [Op.gt]: new Date() },
        };
        const tasks = [];
        if (userId) {
            // and not role
            const users = await db.User.findAll({ where: searchParams });
            const query = users.map(async ({ id }) => {
                const task = await db.Task.findOne({ where: { user: id } });
                tasks.push(task);
            });
            await Promise.all(query);
        }
        // if (roleId) {

        // }
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
            attributes: ['id', 'date', 'churchId', 'userId'],
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
        const { date, time, userId, churchId, eventId } = req.body;
        const { timezone } = await db.Church.findOne({ where: { id: churchId } });
        const taskDate = setDate(date, time, timezone);
        const task = await db.Task.create({
            eventId,
            userId,
            date: new Date(taskDate.toString()),
        });
        return res.status(201).json(task);
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

// used for updating schedule (changing who is assigned to a task), no swapping involved
router.patch(
    '/tasks/updateTask/:targetTaskId/assignTo/:assigneeId',
    certify,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { targetTaskId, assigneeId } = req.params;
            const targetTask = await db.Task.findOne({
                where: { id: targetTaskId },
                attributes: ['id', 'userId'],
            });

            if (targetTask && targetTask.userId !== parseInt(assigneeId)) {
                await targetTask.update({ userId: assigneeId });
                return res.status(200).send(targetTask);
            }
            return res.status(400).send({ message: 'error' });
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
            // this endpoint is messed up. needs rewriting
            const task = await db.Task.findOne({
                where: { id: taskId },
                attributes: ['id', 'userId'],
            });

            const replacingTeammate = await db.UserRole.findOne({
                where: { id: userRoleId },
                attributes: ['id'],
            });

            const askingTeammate = await db.User.findOne({
                where: { id: task.userId },
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
