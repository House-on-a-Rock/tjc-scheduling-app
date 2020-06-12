import express, { Request, Response, NextFunction } from 'express';
import Sequelize from 'sequelize';
import crypto from 'crypto';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import { UserInstance } from 'shared/SequelizeTypings/models';
import helper from '../helper_functions';
import db from '../index';

const router = express.Router();
let cert;
let privateKey;
fs.readFile('tjcschedule_pub.pem', function read(err, data) {
    if (err) throw err;
    cert = data;
    // console.log(cert);
});

fs.readFile('tjcschedule.pem', function read(err, data) {
    if (err) throw err;
    privateKey = data;
    // console.log(privateKey);
});

const { Op } = Sequelize;

module.exports = router;

router.post(
    '/authenticate',
    async (req: Request, res: Response, next: NextFunction) => {},
);

router.post('/user', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let doesUserExist = false;
        const username = req.body.email;
        console.log(typeof username, username);
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

            helper.sendVerEmail(username, req, res, token);
        }
    } catch (err) {
        next(err);
    }
});

router.get('/confirmation', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let isValidToken = false;
        const currentTime = Date.now();
        console.log(typeof req.query.token, req.query.token);
        const checkToken = await db.Token.findOne({
            where: { token: req.query.token.toString() },
            attributes: ['userId', 'token', 'expiresIn'],
        });
        const expiryTime = new Date(checkToken.expiresIn).getTime();
        console.log(expiryTime, currentTime);
        console.log(expiryTime <= currentTime);
        if (checkToken.token) isValidToken = true;
        if (expiryTime <= currentTime) {
            isValidToken = false;
            console.log('Token expired');
            return res.status(401).send({
                message: 'Token expired',
            });
        }
        if (!isValidToken)
            return res.status(401).send({
                message: 'Token not found',
            });
        const tokenUser = await db.User.findOne({
            where: { id: checkToken.userId },
            attributes: ['isVerified'],
        });

        tokenUser.update({
            id: checkToken.userId,
            isVerified: true,
        });

        res.status(201).send({
            message: 'The account has been verified. Please log in.',
        });
    } catch (err) {
        next(err);
    }
});

router.post('/resendConfirm', async (req: Request, res: Response, next: NextFunction) => {
    const username = req.body.email;
    const newToken = crypto.randomBytes(16).toString('hex');
    // get user id associated with email
    const user = await db.User.findOne({
        where: { email: username },
        attributes: ['id'],
    });
    // get token associated with user
    const userToken = await db.Token.findOne({
        where: { userId: user.id },
        attributes: ['id', 'token', 'expiresIn'],
    });
    // update token entry with new token and extended expire time
    userToken.update({
        id: userToken.id,
        token: newToken,
        expiresIn: Date.now() + 30 * 60 * 1000,
    });
    helper.sendVerEmail(username, req, res, newToken);
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    const userEmail = req.body.email;
    const userPassword = req.body.password;
    const user = await db.User.findOne({
        where: { email: userEmail },
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
    //checks if email returns a user, if not it will send error
    if (!user) {
        return res.status(401).send({
            message: 'Invalid Username or Password',
        });
    }

    const checkedHash = crypto
        .createHash('rsa-sha256')
        .update(userPassword)
        .update(user.salt)
        .digest('hex');
    if (checkedHash !== user.password) {
        return res.status(401).send({
            message: 'Invalid Username or Password',
        });
    }

    if (!user.isVerified) {
        return res.status(403).send({
            message: 'Please verify your email',
        });
    }
    console.log('Creating token');
    const token = jwt.sign(
        {
            iss: process.env.AUDIENCE,
            sub: `tjc-scheduling|${user.id}`,
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
        },
        {
            key: privateKey,
            passphrase: process.env.PRIVATEKEY_PASS,
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
            const userEmail = req.body.email;
            const user = await db.User.findOne({
                where: { email: userEmail },
                attributes: ['id', 'password', 'salt'],
            });

            user.update({
                id: user.id,
                password: req.body.password,
            });

            res.status(201).send({
                message: 'Password change success.',
            });

            // }
        } catch (err) {
            next(err);
        }
    },
);
