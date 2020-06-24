import express, { Request, Response, NextFunction } from 'express';
import Sequelize from 'sequelize';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import db from '../index';

const router = express.Router();
const { Op } = Sequelize;
let cert;
fs.readFile('tjcschedule_pub.pem', function read(err, data) {
    if (err) throw err;
    cert = data;
    console.log(cert);
});
module.exports = router;

router.get('/tasks', async (req: Request, res: Response, next: NextFunction) => {
    try {
        jwt.verify(req.headers.authorization, cert);
        if (req.query.userId && !req.query.taskId) {
            const tasks = await db.Task.findAll({
                where: {
                    UserId: req.query.userId.toString(),
                    // ChurchId: req.query.id.toString(),
                    date: {
                        // TODO pass in dates dynamically based on current date
                        [Op.between]: [
                            '2020-03-07T00:00:00.000Z',
                            '2020-07-30T00:00:00.000Z',
                        ],
                    },
                },
                attributes: ['date'],
                include: [
                    {
                        model: db.Role,
                        as: 'role',
                        // attributes: ['name'],
                    },
                    {
                        model: db.Church,
                        as: 'church',
                        attributes: ['name'],
                    },
                ],
            });
            res.status(200).json(tasks);
        } else if (req.query.taskId && !req.query.userId) {
            const task = await db.Task.findOne({
                where: { id: req.query.taskId.toString() },
                attributes: ['UserId', 'date'],
                include: [
                    {
                        model: db.Role,
                        as: 'role',
                        // attributes: ['name'],
                    },
                    {
                        model: db.Church,
                        as: 'church',
                        attributes: ['name'],
                    },
                ],
            });
            res.status(200).json(task);
        }
    } catch (err) {
        if (err) {
            return res.status(404).send({
                message: 'Server error, try again later',
            });
        }
        next(err);
    }
});

router.post('/tasks', async (req: Request, res: Response, next: NextFunction) => {
    try {
        jwt.verify(req.headers.authorization, cert);
        const task = await db.Task.create({
            date: req.body.date,
        });
        res.send(task);
    } catch (err) {
        next(err);
    }
});

router.delete('/tasks/:taskId', async (req: Request, res: Response, next) => {
    try {
        jwt.verify(req.headers.authorization, cert);
        const task = await db.Task.findOne({
            where: { id: req.params.taskId },
        });

        await task.destroy().then(function () {
            res.status(200).send({ message: 'Task deleted' });
        });
    } catch (err) {
        next(err);
    }
});

router.patch(
    '/tasks/switchTask/:targetTaskId/switchWith/:switchTaskId',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            jwt.verify(req.headers.authorization, cert);
            const targetTask: any = await db.Task.findOne({
                where: { id: req.params.targetTaskId },
                attributes: ['id', 'date', 'ChurchId', 'UserId', 'RoleId'],
            });

            const switchTask: any = await db.Task.findOne({
                where: { id: req.params.switchTaskId },
                attributes: ['id', 'date', 'ChurchId', 'UserId', 'RoleId'],
            });

            // if (targetTask.ChurchId === switchTask.ChurchId) {
            const targetTaskId = targetTask.UserId;
            const switchTaskId = switchTask.UserId;
            targetTask.update({
                id: targetTask.id,
                UserId: switchTaskId,
            });

            switchTask.update({
                id: switchTask.id,
                UserId: targetTaskId,
            });
            res.status(200).send({ message: 'Task switch successful' });
            // }
        } catch (err) {
            next(err);
        }
    },
);

router.patch(
    '/tasks/replaceTask/:taskId/replacedBy/:userId',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            jwt.verify(req.headers.authorization, cert);
            const task: any = await db.Task.findOne({
                where: {
                    id: req.params.taskId.toString(),
                },
                attributes: ['id', 'UserId'],
            });

            const replacedByUser: any = await db.User.findOne({
                where: { id: req.params.userId.toString() },
                attributes: ['ChurchId'],
            });

            const belongsToUser: any = await db.User.findOne({
                where: { id: task.UserId },
                attributes: ['ChurchId'],
            });

            // if (replacedByUser.ChurchId === belongsToUser.ChurchId) {
            task.update({
                id: task.id,
                UserId: req.params.userId.toString(),
            });
            res.status(200).send({ message: 'Task replacement successful.' });
            // }
        } catch (err) {
            next(err);
        }
    },
);
