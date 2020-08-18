import express, { Request, Response } from 'express';
import fs from 'fs';
import Sequelize from 'sequelize';
import jwt, { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import crypto from 'crypto';
import { UserInstance } from 'shared/SequelizeTypings/models';
import db from '../index';
import helper from '../helper_functions';

const router = express.Router();
const { Op } = Sequelize;
let cert;
fs.readFile('tjcschedule_pub.pem', function read(err, data) {
    if (err) throw err;
    cert = data;
});

module.exports = router;

router.get('/users', async (req: Request, res: Response, next) => {
    try {
        jwt.verify(req.headers.authorization, cert);
        const searchArray = [];
        if (req.query.churchId) searchArray.push({ churchId: req.query.churchId });
        if (req.query.roleId) {
            const userRoles = await db.UserRole.findAll({
                where: { roleId: req.query.roleId },
                attributes: ['userId'],
            });
            if (userRoles.length === 0)
                return res
                    .status(404)
                    .send({ message: 'No users found with that role id' });
            const userIds = userRoles.map((userRole) => {
                return userRole.userId;
            });
            searchArray.push({ id: userIds });
        }
        const searchParams = {
            [Op.and]: searchArray,
        };
        console.log(searchParams);
        const users: UserInstance[] = await db.User.findAll({
            where: searchParams,
            attributes: ['id', 'firstName', 'lastName', 'email', 'churchId', 'disabled'],
            include: [
                {
                    model: db.Church,
                    as: 'church',
                    attributes: ['name'],
                },
            ],
        });
        if (users.length > 0) res.status(200).json(users);
        else res.status(404).send({ message: 'Not found' });
    } catch (err) {
        if (err instanceof TokenExpiredError || err instanceof JsonWebTokenError) {
            res.status(401).send({ message: 'Unauthorized' });
        } else {
            res.status(503).send({ message: 'Server error, try again later' });
        }
        next(err);
    }
});

router.get('/users/:userId', async (req, res, next) => {
    try {
        jwt.verify(req.headers.authorization, cert);
        const parsedId = req.params.userId.toString();
        const user = await db.User.findOne({
            where: {
                id: parsedId,
            },
            attributes: [
                'firstName',
                'lastName',
                'email',
                'id',
                'churchId',
                'expoPushToken',
            ],
            include: [
                {
                    model: db.Church,
                    as: 'church',
                    attributes: ['name'],
                },
            ],
        });

        if (user) res.json(user);
        else res.status(404).send({ message: 'Not found' });
    } catch (err) {
        if (err instanceof TokenExpiredError || err instanceof JsonWebTokenError) {
            res.status(401).send({ message: 'Unauthorized' });
        } else {
            res.status(503).send({ message: 'Server error, try again later' });
        }
        next(err);
    }
});

router.post('/users', async (req: Request, res: Response, next) => {
    try {
        jwt.verify(req.headers.authorization, cert);
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
        if (!helper.validateEmail(req.body.email)) {
            return res.status(406).send({ message: 'Invalid email' });
        }
        if (!doesUserExist) {
            const newUser: UserInstance = await db.User.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password,
                churchId: req.body.churchId,
                isVerified: false,
                disabled: false,
            });

            const addedUser = await db.User.findOne({
                where: { email: username },
                attributes: ['id', 'firstName', 'lastName', 'email', 'disabled'],
                include: [
                    {
                        model: db.Church,
                        as: 'church',
                        attributes: ['name'],
                    },
                ],
            });
            db.Token.create({
                userId: addedUser.id,
                token: token,
            });

            helper.sendVerEmail(username, req, token, 'confirmation');

            res.status(201).json(addedUser);
        }
    } catch (err) {
        if (err instanceof TokenExpiredError || err instanceof JsonWebTokenError) {
            res.status(401).send({ message: 'Unauthorized' });
        } else {
            res.status(503).send({ message: 'Server error, try again later' });
        }
        next(err);
    }
});

router.delete('/users/:userId', async (req: Request, res: Response, next) => {
    try {
        jwt.verify(req.headers.authorization, cert);
        const user = await db.User.findOne({
            where: { id: req.params.userId },
            attributes: ['id'],
        });
        if (user) {
            await user.destroy().then(function () {
                res.status(200).json(user);
            });
        } else res.status(404).send({ message: 'User not found' });
    } catch (err) {
        if (err instanceof TokenExpiredError || err instanceof JsonWebTokenError) {
            res.status(401).send({ message: 'Unauthorized' });
        } else {
            res.status(503).send({ message: 'Server error, try again later' });
        }
        next(err);
    }
});

//updates expoPushToken on login, may need cleanup or be moved around
router.patch(
    '/users/expoPushToken/:userId',
    async (req: Request, res: Response, next) => {
        try {
            jwt.verify(req.headers.authorization, cert);
            const user = await db.User.findOne({
                where: { id: req.params.userId },
            });
            if (user) {
                user.update({ expoPushToken: req.body.pushToken });
                res.status(200).send({ messageg: 'Push Token updated' });
            } else res.status(404).send({ message: 'User not found' });
        } catch (err) {
            if (err instanceof TokenExpiredError || err instanceof JsonWebTokenError) {
                res.status(401).send({ message: 'Unauthorized' });
            } else {
                res.status(503).send({ message: 'Server error, try again later' });
            }
            next(err);
        }
    },
);
