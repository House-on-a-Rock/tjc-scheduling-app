import express, { Request, Response, NextFunction } from 'express';
import Sequelize from 'sequelize';
import postgres from 'pg';
import crypto from 'crypto';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { TokenInstance, UserInstance } from 'shared/SequelizeTypings/models';
import db from '../index';
import newClient from './pg_helper';

const router = express.Router();
const cert = fs.readFileSync('tjcschedule_pub.pem');
const { Op } = Sequelize;

module.exports = router;

router.post(
    '/authenticate',
    async (req: Request, res: Response, next: NextFunction) => {},
);

router.post('/createUser', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let exist = false;
        const username = req.body.email;
        console.log(typeof username, username);
        const token = crypto.randomBytes(16).toString('hex');
        const checkIfUserExist = await db.User.findOne({
            where: { email: username },
            attributes: ['id', 'email'],
        }).then(function (user) {
            if (user) {
                exist = true;
                return res.status(400).send({
                    message: 'User already exists',
                });
            }
        });
        if (!exist) {
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
                _userId: addedUser.id,
                token: token,
            });

            console.log('Sending email..');
            const transporter = nodemailer.createTransport({
                service: 'Sendgrid',
                auth: {
                    user: process.env.VER_EMAIL,
                    pass: process.env.VER_PASS,
                },
            });

            const mailOptions = {
                from: 'alraneus@gmail.com',
                to: username,
                subject: 'Account Verification Token',
                text: `Hello,\n\n Please verify your account by clicking the link: \nhttp://${req.headers.host}/api/authentication/confirmation?token=${token}`,
            };
            transporter.sendMail(mailOptions, function (err) {
                if (err) {
                    return res.status(500).send({ message: err.message });
                }
                res.status(200).send({
                    message: `A verification email has been sent to ${username}.`,
                });
            });
        }
    } catch (err) {
        next(err);
    }
});

router.get('/confirmation', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let validToken = false;
        const currentTime = Date.now();
        console.log(typeof req.query.token, req.query.token);
        const checkToken = await db.Token.findOne({
            where: { token: req.query.token.toString() },
            attributes: ['_userId', 'token', 'expiresIn'],
        });
        const expiryTime = new Date(checkToken.expiresIn).getTime();
        console.log(expiryTime, currentTime);
        console.log(expiryTime <= currentTime);
        if (checkToken.token) validToken = true;
        if (expiryTime <= currentTime) {
            validToken = false;
            console.log('Token expired');
            return res.status(400).send({
                message: 'Token expired',
            });
        }
        if (!validToken)
            return res.status(400).send({
                message: 'Token not found',
            });
        const tokenUser = await db.User.findOne({
            where: { id: checkToken._userId },
            attributes: ['isVerified'],
        });

        tokenUser.update({
            id: checkToken._userId,
            isVerified: true,
        });

        res.status(200).send({
            message: 'The account has been verified. Please log in.',
        });
    } catch (err) {
        next(err);
    }
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    const username = req.body.email;
    const password = req.body.password;
    const user = await db.User.findOne({
        where: { email: username },
        attributes: [
            'id',
            'firstName',
            'lastName',
            'email',
            'password',
            'salt',
            'isVerified',
        ],
    });
    const checkedHash = crypto
        .createHash('rsa-sha256')
        .update(password)
        .update(user.salt)
        .digest('hex');
    if (checkedHash !== user.password) {
        return res.status(400).send({
            message: 'Invalid Username or Password',
        });
    }

    if (!user.isVerified) {
        return res.status(400).send({
            message: 'Please verify your email',
        });
    }
    console.log('Creating token');
    const privateKey = fs.readFileSync('tjcschedule.pem');
    const token = jwt.sign(
        {
            iss: process.env.AUDIENCE,
            sub: `tjc-scheduling|${user.id}`,
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
        },
        {
            key: privateKey,
            passphrase: 'houseonthehill',
        },
        { algorithm: 'RS256' },
    );

    res.json({
        user_id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        access_token: token,
    });
});

router.post(
    '/changePassword',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log('Entered');
            /* const verify = jwt.verify(req.headers.authorization, cert);
            const decodedToken = jwt.decode(req.headers.authorization, { json: true });
            const requestId = decodedToken.sub.split('|')[1];
            if (requestId === req.body.userId) { */
            const email = req.body.email;
            const user = await db.User.findOne({
                where: { email: email },
                attributes: ['id', 'salt'],
            });

            user.update({
                id: user.id,
                password: req.body.password,
            });

            res.status(200).send({
                message: 'Password change success.',
            });
            // }
        } catch (err) {
            next(err);
        }
    },
);
