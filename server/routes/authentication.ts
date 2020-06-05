import express, { Request, Response, NextFunction } from 'express';
import Sequelize from 'sequelize';
import postgres from 'pg';
import crypto from 'crypto';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { TokenInstance } from 'shared/SequelizeTypings/models';
import db from '../index';
import newClient from './pg_helper';
import { createIconSetFromFontello } from '@expo/vector-icons';

const router = express.Router();
const cert = fs.readFileSync('tjcschedule_pub.pem');
const { Op } = Sequelize;

module.exports = router;

router.post(
    '/authenticate',
    async (req: Request, res: Response, next: NextFunction) => {},
);

router.post('/signUp', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let newUserId;
        const client = newClient();
        const username = req.body.email;
        console.log(typeof username, username);
        const token = crypto.randomBytes(16).toString('hex');
        const salt = crypto.randomBytes(16).toString('base64');
        const passwordHash = crypto
            .createHash(process.env.SECRET_HASH)
            .update(req.body.password)
            .update(salt)
            .digest('hex');
        const query = {
            name: 'sign-up',
            text: `INSERT INTO public."Users"("firstName", "lastName", email, password, salt, "isVerified") VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
            values: [
                req.body.firstName,
                req.body.lastName,
                username,
                passwordHash,
                salt,
                false,
            ],
        };
        const checkIfUserExist = await db.User.findOne({
            where: { email: username },
        }).then(function (user) {
            if (user)
                return res.status(400).send({
                    message: 'User already exists',
                });
            client.connect();
            client.query(query, (err, result) => {
                console.log('querying');
                if (err) {
                    console.log(err.stack);
                }
                client.end();

                const user = result.rows[0];
                console.log(user);
                db.Token.create({
                    _userId: user.id,
                    token: token,
                });
            });

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
                text:
                    'Hello,\n\n' +
                    'Please verify your account by clicking the link: \nhttp://' +
                    req.headers.host +
                    '/api/authentication/confirmation?token=' +
                    token,
            };
            transporter.sendMail(mailOptions, function (err) {
                if (err) {
                    return res.status(500).send({ message: err.message });
                }
                res.status(200).send({
                    message: 'A verification email has been sent to ' + username + '.',
                });
            });
        });
    } catch (err) {
        next(err);
    }
});

router.get('/confirmation', async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(typeof req.query.token, req.query.token);
        const client = newClient();
        const checkToken = await db.Token.findOne({
            where: { token: req.query.token.toString() },
        }).then(function (token) {
            console.log(token);
            if (!token)
                return res.status(400).send({
                    message: 'Token not found',
                });
            const query = {
                name: 'update-verify',
                text: `UPDATE public."Users" SET "isVerified" = $1 WHERE id = $2`,
                values: [true, token._userId],
            };
            client.connect();
            client.query(query, (err, result) => {
                if (err) {
                    console.log(err.stack);
                }
                console.log(result);
                client.end();
            });
            res.status(200).send({
                message: 'The account has been verified. Please log in.',
            });
        });
    } catch (err) {
        next(err);
    }
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    const postgres_client = newClient();
    const username = req.body.email;
    const password = req.body.password;
    const query = {
        name: 'fetch-user',
        text: `SELECT id, "firstName", "lastName", email, password, salt FROM public."Users" WHERE email = $1`,
        values: [username],
    };
    postgres_client.connect();
    postgres_client.query(query, (err, result) => {
        if (err) {
            console.log(err.stack);
        } else {
            // console.log(result.rows[0]);
            const user = result.rows[0];
            const checkedHash = crypto
                .createHash('rsa-sha256')
                .update(password)
                .update(user.salt)
                .digest('hex');
            // console.log(user.email);
            // console.log(checkedHash);
            // console.log(password);
            if (checkedHash !== user.password) {
                return res.status(400).send({
                    message: 'Invalid Username or Password',
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
            postgres_client.end();
        }
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
            const newPassword = req.body.password;
            const email = req.body.email;
            const client = newClient();
            let query = {
                name: 'get-salt',
                text: `SELECT salt FROM public."Users" WHERE email = $1`,
                values: [email],
            };
            client.connect();
            client.query(query, (err, result) => {
                if (err) {
                    console.log(err.stack);
                } else {
                    console.log('Query 1');
                    const user = result.rows[0];
                    const newHash = crypto
                        .createHash('rsa-sha256')
                        .update(newPassword)
                        .update(user.salt)
                        .digest('hex');
                    console.log(newHash);
                    query = {
                        name: 'change-password',
                        text: `UPDATE public."Users" SET password = $1 WHERE email = $2`,
                        values: [newHash, email],
                    };
                    client.query(query, (error, result1) => {
                        console.log('Query 2');
                        console.log(query);
                        if (error) {
                            console.log(error.stack);
                        }
                        client.end();
                    });
                    res.status(200).send({
                        message: 'Password change success.',
                    });
                }
            });
            // }
        } catch (err) {
            next(err);
        }
    },
);
