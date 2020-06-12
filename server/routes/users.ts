import express, { Request, Response } from 'express';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { UserInstance } from 'shared/SequelizeTypings/models';
import db from '../index';
import helper from '../helper_functions';

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
        res.json(user);
    } catch (err) {
        next(err);
    }
});

router.post('/createUser', async (req: Request, res: Response, next) => {
    try {
        let doesUserExist = false;
        const username = req.body.email;
        const token = crypto.randomBytes(16).toString('hex');
        const checkIfUserExist = await db.User.findOne({
            where: { email: username },
            attributes: ['id', 'email'],
        }).then(function (user) {
            if (user) {
                doesUserExist = true;
                return res.status(409).send({
                    message: 'User already exists',
                });
            }
            return true;
        });
        if (!doesUserExist) {
            const newUser: UserInstance = await db.User.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password,
                isVerified: false,
            });

            const addedUser = await db.User.findOne({
                where: { email: username },
                attributes: ['id'],
            });
            db.Token.create({
                userId: addedUser.id,
                token: token,
            });

            helper.sendVerEmail(username, req, res, token, 'confirmation');
        }
    } catch (err) {
        next(err);
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
