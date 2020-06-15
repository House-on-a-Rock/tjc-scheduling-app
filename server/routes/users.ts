import express, { Request, Response } from 'express';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import { UserInstance } from 'shared/SequelizeTypings/models';
import db from '../index';

const router = express.Router();
let cert;
fs.readFile('tjcschedule_pub.pem', function read(err, data) {
    if (err) throw err;
    cert = data;
    console.log(cert);
});

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
        //
        res.json(user);
    } catch (err) {
        return res.status(403).send({
            message: 'error retrieving profile',
        });
        // next(err);
    }
});

router.post('/deleteUser', async (req: Request, res: Response, next) => {
    try {
        const user = await db.User.findOne({
            where: { id: req.body.userId },
        });

        await user.destroy().then(function () {
            res.status(200).send({ message: 'User deleted' });
        });
    } catch (err) {
        next(err);
    }
});
