import express, { Request, Response, NextFunction } from 'express';
import Sequelize from 'sequelize';
import postgres from 'pg';
import crypto from 'crypto';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import db from '../index';

const router = express.Router();
const cert = fs.readFileSync('tjcschedule_pub.pem');
const { Op } = Sequelize;

module.exports = router;

router.post(
    '/authenticate',
    async (req: Request, res: Response, next: NextFunction) => {},
);

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    const postgres_client = new postgres.Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: 'testdb',
        password: process.env.DB_PASS,
        port: 5432,
    });
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
            console.log(result.rows[0]);
            const user = result.rows[0];
            const checkedHash = crypto
                .createHash('rsa-sha256')
                .update(password)
                .update(user.salt)
                .digest('hex');
            console.log(user.email);
            console.log(checkedHash);
            console.log(password);
            if (checkedHash !== user.password) {
                return res.status(200).send({
                    message: 'Invalid Username or Password',
                });
            }

            const privateKey = fs.readFileSync('tjcschedule.pem');
            const token = jwt.sign(
                {
                    iss: process.env.AUDIENCE,
                    sub: `tjc-scheduling|${user.id}`,
                    exp: Math.floor(Date.now() / 1000) + 60 * 1,
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

router.get('/getUser', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const verify = jwt.verify(req.headers.authorization, cert);
        const decodedToken = jwt.decode(req.headers.authorization, { json: true });
        console.log(decodedToken);
        const requestId = decodedToken.sub.split('|')[1];
        console.log(typeof requestId, requestId);
        console.log(typeof req.query.id, req.query.id);
        if (requestId === req.query.id) {
            console.log('Success');
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
        } else {
            res.status(404).send({
                message: 'Invalid Request',
            });
        }
    } catch (err) {
        next(err);
    }
});

router.get('/getUserTasks', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const verify = jwt.verify(req.headers.authorization, cert);
        console.log(verify);
        const decodedToken = jwt.decode(req.headers.authorization, { json: true });
        const requestId = decodedToken.payload.sub.split('|')[1];
        if (requestId === req.query.id) {
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
        } else {
            res.status(404);
        }
    } catch (err) {
        next(err);
    }
});
