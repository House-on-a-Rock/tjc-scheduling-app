import express, { Request, Response, NextFunction } from 'express';
import Sequelize from 'sequelize';
import crypto from 'crypto';
import fs from 'fs';
import jwt, { Algorithm } from 'jsonwebtoken';
import request from 'request-promise';
import { UserInstance } from 'shared/SequelizeTypings/models';
import helper from '../helper_functions';
import db from '../index';

const router = express.Router();
let cert;
let privateKey;
fs.readFile('tjcschedule_pub.pem', function read(err, data) {
    if (err) throw err;
    cert = data;
});

fs.readFile('tjcschedule.pem', function read(err, data) {
    if (err) throw err;
    privateKey = data;
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
    try {
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
        helper.sendVerEmail(username, req, res, newToken, 'confirmation');
    } catch (err) {
        next(err);
    }
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
        { algorithm: process.env.JWT_ALGORITHM as Algorithm },
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
    '/confirmPassword',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await db.User.findOne({
                where: { email: req.body.email },
                attributes: ['salt', 'password'],
            });

            const checkedHash = crypto
                .createHash('rsa-sha256')
                .update(req.body.password)
                .update(user.salt)
                .digest('hex');

            if (checkedHash !== user.password) {
                res.status(401).send({
                    message: 'Invalid credentials',
                    verify: false,
                });
            } else {
                res.status(200).send({
                    message: 'Password confirmed',
                    verify: true,
                });
            }
        } catch (err) {
            next(err);
        }
    },
);

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
            const options = {
                method: 'POST',
                uri: `http://${process.env.SECRET_IP}/api/authentication/confirmPassword`,
                body: {
                    email: userEmail,
                    password: req.body.oldPass,
                },
                json: true,
            };
            const verifyOldPassword = await request(options);

            console.log(verifyOldPassword);
            const user = await db.User.findOne({
                where: { email: userEmail },
                attributes: ['id', 'password', 'salt'],
            });

            if (verifyOldPassword.verify) {
                user.update({
                    id: user.id,
                    password: req.body.password,
                });

                res.status(200).send({
                    message: 'Password change success.',
                });
            }

            // }
        } catch (err) {
            next(err);
        }
    },
);

router.post(
    '/sendRecoverEmail',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const expiryTime = helper.addMinutes(new Date(), 30);
            const recovToken = crypto.randomBytes(16).toString('hex');
            const user = await db.User.findOne({
                where: { email: req.body.email },
                attributes: ['id', 'isVerified'],
            });

            if (user && user.isVerified) {
                user.update({
                    id: user.id,
                    token: `${recovToken}|${expiryTime.getTime().toString()}`,
                });
                // helper.sendVerEmail(
                //     req.body.email,
                //     req,
                //     res,
                //     recovToken,
                //     'resetPasswordPage',
                // );
                res.status(200).send({
                    message: 'Recovery token created',
                    token: `${recovToken}|${expiryTime.getTime().toString()}`,
                });
            } else {
                res.status(400).send({
                    message: 'Invalid or unverified user',
                });
            }
        } catch (err) {
            next(err);
        }
    },
);

router.post(
    '/recoverPassword',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const currentTime = Date.now();
            const user = await db.User.findOne({
                where: { token: req.body.token },
                attributes: ['id', 'isVerified', 'token'],
            });
            const expiryTime = parseInt(user.token.split('|')[1], 10);
            console.log(expiryTime, currentTime);
            if (expiryTime > currentTime) {
                console.log(user);
                if (user.isVerified && req.body.password === req.body.confirmPassword) {
                    user.update({
                        id: user.id,
                        password: req.body.password,
                        token: null,
                    });

                    res.status(201).send({
                        message: 'Password change success.',
                    });
                } else {
                    res.status(400).send({
                        message:
                            'User does not exist or is not verified or passwords do not match',
                    });
                }
            } else {
                res.status(400).send({
                    message: 'Recovery token invalid or expired',
                });
            }
        } catch (err) {
            next(err);
        }
    },
);
