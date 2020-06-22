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
        return res.status(404).send({
            // message: 'error retrieving tasks',
            message: 'Server error, try again later',
        });
        // next(err);
    }
});

router.post('/task', async (req: Request, res: Response, next: NextFunction) => {
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
