import express, { Request, Response, NextFunction } from 'express';
import db from '../index';
import checkJwt from './jwt_helper_function';

const router = express.Router();
module.exports = router;

router.get(
    '/getAllUserTasks',
    checkJwt,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const task = await db.Task.findAll({
                where: { user: req.body.user },
            });
            res.status(200).json(task);
        } catch (err) {
            next(err);
        }
    },
);

router.post(
    '/createTask',
    checkJwt,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const task = await db.Task.create({
                date: req.body.date,
            });
            res.send(task);
        } catch (err) {
            next(err);
        }
    },
);
