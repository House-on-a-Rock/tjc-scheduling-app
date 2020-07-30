import express, { Request, Response, NextFunction } from 'express';
import Sequelize from 'sequelize';
import fs from 'fs';
import jwt, { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import db from '../index';

const router = express.Router();
const { Op } = Sequelize;
let cert;
fs.readFile('tjcschedule_pub.pem', function read(err, data) {
    if (err) throw err;
    cert = data;
});
module.exports = router;

router.get('/tasks', async (req: Request, res: Response, next: NextFunction) => {
    try {
        // jwt.verify(req.headers.authorization, cert);
        const searchArray = [];
        if (req.query.userId) {
            searchArray.push({ UserId: req.query.userId });
        } else if (req.query.churchId) {
            searchArray.push({ ChurchId: req.query.churchId });
        } else if (req.query.roleId) {
            searchArray.push({ RoleId: req.query.roleId });
        }
        const searchParams = {
            [Op.and]: searchArray,
        };
        const tasks = await db.Task.findAll({
            where: searchParams,
            attributes: ['id', 'UserId', 'RoleId', 'date', 'createdAt'],
            include: [
                {
                    model: db.Role,
                    as: 'role',
                    attributes: ['name'],
                },
                {
                    model: db.Church,
                    as: 'church',
                    attributes: ['name'],
                },
            ],
        });
        if (tasks) {
            res.status(200).json(tasks);
        } else {
            res.status(404).send({ message: 'Not found' });
        }
    } catch (err) {
        if (err instanceof TokenExpiredError || err instanceof JsonWebTokenError) {
            res.status(401).send({ message: 'Unauthorized' });
        } else {
            res.status(503).send({ message: 'Server error, try again later' });
        }
        next(err);
    }
});

router.get('/tasks/:taskId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        jwt.verify(req.headers.authorization, cert);
        const task = await db.Task.findOne({
            where: { taskId: req.params.taskId },
            attributes: ['id', 'date', 'ChurchId', 'UserId', 'RoleId'],
        });
        if (task) res.status(200).json(task);
        else res.status(404).send({ message: 'Task not found' });
    } catch (err) {
        if (err instanceof TokenExpiredError || err instanceof JsonWebTokenError) {
            res.status(401).send({ message: 'Unauthorized' });
        } else {
            res.status(503).send({ message: 'Server error, try again later' });
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
        res.status(201).send(task);
    } catch (err) {
        if (err instanceof TokenExpiredError || err instanceof JsonWebTokenError) {
            res.status(401).send({ message: 'Unauthorized' });
        } else {
            res.status(503).send({ message: 'Server error, try again later' });
        }
        next(err);
    }
});

router.delete('/tasks/:taskId', async (req: Request, res: Response, next) => {
    try {
        jwt.verify(req.headers.authorization, cert);
        const task = await db.Task.findOne({
            where: { id: req.params.taskId },
        });
        if (task) {
            await task.destroy().then(function () {
                res.status(200).send({ message: 'Task deleted' });
            });
        } else {
            res.status(404).send({ message: 'Task not found' });
        }
    } catch (err) {
        if (err instanceof TokenExpiredError || err instanceof JsonWebTokenError) {
            res.status(401).send({ message: 'Unauthorized' });
        } else {
            res.status(503).send({ message: 'Server error, try again later' });
        }
        next(err);
    }
});

router.patch(
    '/tasks/switchTask/:targetTaskId/switchWith/:switchTaskId',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            jwt.verify(req.headers.authorization, cert);
            const targetTask = await db.Task.findOne({
                where: { id: req.params.targetTaskId },
                attributes: ['id', 'date', 'ChurchId', 'UserId', 'RoleId'],
            });

            const switchTask = await db.Task.findOne({
                where: { id: req.params.switchTaskId },
                attributes: ['id', 'date', 'ChurchId', 'UserId', 'RoleId'],
            });
            if (!targetTask || !switchTask) {
                return res.status(404).send({ message: 'Not found' });
            }
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
            if (err instanceof TokenExpiredError || err instanceof JsonWebTokenError) {
                res.status(401).send({ message: 'Unauthorized' });
            } else {
                res.status(503).send({ message: 'Server error, try again later' });
            }
            next(err);
        }
    },
);

router.patch(
    '/tasks/replaceTask/:taskId/replacedBy/:userId',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            jwt.verify(req.headers.authorization, cert);
            const task = await db.Task.findOne({
                where: {
                    id: req.params.taskId.toString(),
                },
                attributes: ['id', 'UserId'],
            });

            const replacedByUser = await db.User.findOne({
                where: { id: req.params.userId.toString() },
                attributes: ['id', 'ChurchId'],
            });

            const belongsToUser = await db.User.findOne({
                where: { id: task.UserId },
                attributes: ['id', 'ChurchId'],
            });
            if (!task || !replacedByUser || !belongsToUser) {
                return res.status(404).send({ message: 'Not found' });
            }
            // if (replacedByUser.ChurchId === belongsToUser.ChurchId) {
            await task.update({
                id: task.id,
                UserId: replacedByUser.id,
            });
            res.status(200).send({ message: 'Task replacement successful.' });
            // }
        } catch (err) {
            if (err instanceof TokenExpiredError || err instanceof JsonWebTokenError) {
                res.status(401).send({ message: 'Unauthorized' });
            } else {
                res.status(503).send({ message: 'Server error, try again later' });
            }
            next(err);
        }
    },
);
