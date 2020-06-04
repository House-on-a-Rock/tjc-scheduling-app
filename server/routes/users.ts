import express, { Request, Response } from 'express';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import { UserInstance } from 'shared/SequelizeTypings/models';
import db from '../index';

const router = express.Router();
const cert = fs.readFileSync('tjcschedule_pub.pem');

module.exports = router;

router.get('/getAllUsers', async (req: Request, res: Response, next) => {
    try {
        const verify = jwt.verify(req.headers.authorization, cert);
        const users: UserInstance[] = await db.User.findAll({
            attributes: ['firstName', 'lastName', 'email', 'ChurchId'],
        });
        res.status(200).json(users);
    } catch (err) {
        next(err);
    }
});

router.get('/getUser', async (req, res, next) => {
    try {
        const verify = jwt.verify(req.headers.authorization, cert);
        // const parsedId = req.query.id.toString();
        const user = await db.User.findOne({
            where: {
                id: '1',
                // req.query.id.toString(),
            },
            attributes: ['firstName', 'lastName', 'email', 'id'],
            include: [
                {
                    model: db.Church,
                    as: 'church',
                    attributes: ['name'],
                },
            ],
        });
        res.json(user);
    } catch (err) {
        next(err);
    }
});
