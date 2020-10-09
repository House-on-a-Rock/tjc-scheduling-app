import express, { Request, Response, NextFunction } from 'express';
import Sequelize from 'sequelize';
import jwt from 'jsonwebtoken';
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
            date: { [Op.gt]: new Date() },
        };
        const tasks = await db.Task.findAll({
            where: searchParams,
            attributes: [['id', 'taskId'], 'userId', 'roleId', 'date', 'createdAt'],
            include: [
                {
                    model: db.Role,
                    as: 'role',
                    attributes: ['name'],
                },
                {
                    model: db.Church,
                    as: 'church',
                    attributes: ['name', ['id', 'churchId']],
                },
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['firstName', 'lastName'],
                },
            ],
            order: [['date', 'ASC']],
        });
        return tasks ? res.status(200).json(tasks) : res.status(404).send({ message: 'Not found' });
    } catch (err) {
        next(err);
        return res.status(503).send({ message: 'Server error, try again later' });
    }
});

router.get('/tasks/:taskId', certify, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const task = await db.Task.findOne({
            where: { taskId: req.params.taskId },
            attributes: ['id', 'date', 'churchId', 'userId', 'roleId'],
        });
        return task ? res.status(200).json(task) : res.status(404).send({ message: 'Task not found' });
    } catch (err) {
        next(err);
        return res.status(503).send({ message: 'Server error, try again later' });
    }
});

router.post('/tasks', certify, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { date, time, roleId } = req.body;
        const userId = jwt.decode(req.headers.authorization, { json: true }).sub.split('|')[1];
        const { church } = await db.User.findOne({
            where: { id: userId },
            include: [
                {
                    model: db.Church,
                    as: 'church',
                    attributes: ['id', 'name', 'address', 'timezone'],
                },
            ],
        });
        const taskDate = setDate(date, time, church.timezone);
        const task = await db.Task.create({
            date: new Date(taskDate.toString()),
            churchId: church.id,
            roleId,
            userId: parseInt(userId, 10),
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
                attributes: ['id', 'date', 'churchId', 'userId', 'roleId'],
            });

            const switchTask = await db.Task.findOne({
                where: { id: switchTaskId },
                attributes: ['id', 'date', 'churchId', 'userId', 'roleId'],
            });

            const [message, status] =
                !targetTask || !switchTask ? ['Task switch successful', 200] : ['Task not found', 404];

            if (status === 200) {
                await targetTask.update({
                    id: targetTask.id,
                    userId: switchTask.userId,
                });

                await switchTask.update({
                    id: switchTask.id,
                    userId: targetTask.userId,
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
    '/tasks/replaceTask/:taskId/replacedBy/:userId',
    certify,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { taskId, userId } = req.params;
            const task = await db.Task.findOne({
                where: {
                    id: taskId,
                },
                attributes: ['id', 'userId'],
            });

            const replacedByUser = await db.User.findOne({
                where: { id: userId },
                attributes: ['id', 'churchId'],
            });

            const belongsToUser = await db.User.findOne({
                where: { id: task.userId },
                attributes: ['id', 'churchId'],
            });
            const [message, status] =
                !task || !replacedByUser || !belongsToUser
                    ? ['Task replacement successful', 200]
                    : ['Task not found', 404];

            if (status === 200)
                await task.update({
                    id: task.id,
                    userId: replacedByUser.id,
                });
            return res.status(status).send({ message });
        } catch (err) {
            next(err);
            return res.status(503).send({ message: 'Server error, try again later' });
        }
    },
);
