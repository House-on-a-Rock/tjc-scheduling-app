import express, { Request, Response, NextFunction } from 'express';
import Sequelize from 'sequelize';
import crypto from 'crypto';
import fs from 'fs';
import jwt, { Algorithm } from 'jsonwebtoken';
import request from 'request-promise';
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
    const currentTime = new Date();
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
            'loginAttempts',
            'loginTimeout',
            'isVerified',
        ],
    });
    // checks if email returns a user, if not it will send error
    if (!user) return res.status(401).send({ message: 'Invalid Username or Password' });

    // check login attempts and whether a timeout has initiated
    if (user.loginTimeout && user.loginTimeout.getTime() >= currentTime.getTime()) {
        return res.status(400).send({
            message: 'Too many login attempts',
        });
    }

    const checkedHash = crypto
        .createHash('rsa-sha256')
        .update(userPassword)
        .update(user.salt)
        .digest('hex');

    if (checkedHash !== user.password) {
        if (user.loginAttempts >= 3) {
            user.update({
                id: user.id,
                loginAttempts: 0,
                loginTimeout: helper.addMinutes(new Date(), 5),
            });
        } else {
            user.update({
                id: user.id,
                loginAttempts: user.loginAttempts + 1,
            });
        }
        return res.status(401).send({
            message: 'Invalid Username or Password',
        });
    }

    if (!user.isVerified) {
        return res.status(403).send({
            message: 'Please verify your email',
        });
    }
    const token = helper.createToken('reg', user.id, 60);

    // if login is successful, reset login attempt information
    user.update({
        id: user.id,
        loginAttempts: 0,
        loginTimeout: null,
    });

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
                res.status(400).send({
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
    '/sendResetEmail',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await db.User.findOne({
                where: { email: req.body.email },
                attributes: ['id', 'isVerified'],
            });

            if (user && user.isVerified) {
                const token = helper.createToken('pwd_reset', user.id, 15);
                // helper.sendVerEmail(
                //     req.body.email,
                //     req,
                //     res,
                //     recovToken,
                //     'resetPasswordPage',
                // );
                res.status(200).send({
                    message: 'Recovery token created',
                    email: req.body.email,
                    token: token,
                });
            } else {
                res.status(200);
            }
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    '/checkResetToken',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token: any = jwt.verify(req.headers.authorization, cert);
            if (token.type === 'pwd_reset') {
                res.status(200).send({ message: 'token valid' });
            } else {
                res.status(401).send({ message: 'token not valid' });
            }
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                return res.status(401).send({ message: 'token expired' });
            }
            next(err);
        }
    },
);

router.post('/resetPassword', async (req: Request, res: Response, next: NextFunction) => {
    try {
        jwt.verify(req.headers.authorization, cert);
        const decodedToken = jwt.decode(req.headers.authorization, { json: true });
        console.log(decodedToken);
        const requestId = decodedToken.sub.split('|')[1];
        const user = await db.User.findOne({
            where: { id: parseInt(requestId, 10) },
            attributes: ['id', 'email', 'isVerified'],
        });
        if (user.email === req.body.email && decodedToken.type === 'pwd_reset') {
            if (user.isVerified) {
                user.update({
                    id: user.id,
                    password: req.body.password,
                    token: null,
                });

                res.status(201).send({
                    message: 'Password change success.',
                });
            } else {
                res.status(401).send({
                    message:
                        'User does not exist or is not verified or passwords do not match',
                });
            }
        } else {
            res.status(401).send({
                message: 'Invalid Request',
            });
        }
    } catch (err) {
        next(err);
    }
});
