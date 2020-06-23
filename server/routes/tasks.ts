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

router.get('/userTasks', async (req: Request, res: Response, next: NextFunction) => {
    try {
        jwt.verify(req.headers.authorization, cert);
        const tasks = await db.Task.findAll({
            where: {
                UserId: req.query.id.toString(),
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
        res.json(tasks);
    } catch (err) {
        return res.status(404).send({
            message: 'Server error, try again later',
        });
        // next(err);
    }
});

router.post('/task', async (req: Request, res: Response, next: NextFunction) => {
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

router.post('/replaceTask', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const task: any = await db.Task.findOne({
            where: {
                id: req.body.taskId,
            },
            attributes: ['id', 'UserId'],
        });

        const replacedByUser: any = await db.User.findOne({
            where: { id: req.body.replacedById },
            attributes: ['ChurchId'],
        });

        const belongsToUser: any = await db.User.findOne({
            where: { id: task.UserId },
            attributes: ['ChurchId'],
        });

        if (replacedByUser.ChurchId === belongsToUser.ChurchId) {
            task.update({
                id: task.id,
                UserId: req.body.replacedById,
            });
        }
    } catch (err) {
        next(err);
    }
});
