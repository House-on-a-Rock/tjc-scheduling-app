import express, { Request, Response, NextFunction } from 'express';
import Sequelize from 'sequelize';
import db from '../index';
import checkJwt from './jwt_helper_function';

const router = express.Router();
const { Op } = Sequelize;

module.exports = router;

router.post(
    '/authenticate',
    async (req: Request, res: Response, next: NextFunction) => {},
);

router.get(
    '/getUser',
    checkJwt,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log(req);
            const parsedId = req.query.id.toString();
            const user = await db.User.findOne({
                where: {
                    // eslint-disable-next-line radix
                    id: parseInt(parsedId),
                },
                attributes: ['firstName', 'lastName', 'email'],
                include: [
                    {
                        model: db.Church,
                        attributes: ['name'],
                    },
                ],
            });
            res.json(user);
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    '/getUserTasks',
    checkJwt,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const tasks = await db.Task.findAll({
                where: {
                    UserId: req.query.id.toString(),
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
                        attributes: ['name'],
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
