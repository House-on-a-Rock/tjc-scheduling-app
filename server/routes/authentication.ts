import express, { Request, Response, NextFunction } from 'express';
import db from '../index';
import Sequelize from 'sequelize';

const router = express.Router();
const Op = Sequelize.Op;
module.exports = router;

router.post(
    '/authenticate',
    async (req: Request, res: Response, next: NextFunction) => {},
);

router.get('/getUser', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsedId = req.query.id.toString();
        const user = await db.User.findOne({
            where: {
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
});

router.get('/getUserTasks', async (req: Request, res: Response, next: NextFunction) => {
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
});
