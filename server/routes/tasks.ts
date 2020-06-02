import express, { Request, Response, NextFunction } from 'express';
import Sequelize from 'sequelize';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import db from '../index';

const router = express.Router();
const { Op } = Sequelize;
const cert = fs.readFileSync('tjcschedule_pub.pem');
module.exports = router;

router.get(
    '/getAllUserTasks',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const verify = jwt.verify(req.headers.authorization, cert);
            const tasks = await db.Task.findAll({
                where: {
                    UserId: req.query.id.toString(),
                    // ChurchId: req.query.id.toString(),
                    date: {
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
            next(err);
        }
    },
);

router.post('/createTask', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const verify = jwt.verify(req.headers.authorization, cert);
        const task = await db.Task.create({
            date: req.body.date,
        });
        res.send(task);
    } catch (err) {
        next(err);
    }
});
