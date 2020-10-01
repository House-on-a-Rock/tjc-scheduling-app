import express, { Request, Response } from 'express';
import Sequelize from 'sequelize';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import crypto from 'crypto';
import { UserInstance } from 'shared/SequelizeTypings/models';
import db from '../index';
import { certify, determineLoginId, sendVerEmail, validateEmail } from '../utilities/helperFunctions';

const router = express.Router();
const { Op } = Sequelize;

module.exports = router;

router.get('/users', certify, async (req: Request, res: Response, next) => {
    try {
        const loggedInId: number = determineLoginId(req.headers.authorization);
        const searchArray = [];
        if (req.query.churchId) searchArray.push({ churchId: req.query.churchId });
        if (req.query.roleId) {
            const userRoles = await db.UserRole.findAll({
                where: { roleId: req.query.roleId },
                attributes: ['userId'],
            });
            if (userRoles.length === 0) return res.status(404).send({ message: 'No users found with that role id' });
            const userIds = userRoles.map((userRole) => {
                return userRole.userId;
            });
            searchArray.push({ id: userIds });
        }
        const searchParams = {
            [Op.and]: searchArray,
            [Op.not]: { id: loggedInId },
        };
        console.log(searchParams);
        const users: UserInstance[] = await db.User.findAll({
            where: searchParams,
            attributes: [['id', 'userId'], 'firstName', 'lastName', 'email', 'churchId', 'disabled'],
            include: [
                {
                    model: db.Church,
                    as: 'church',
                    attributes: ['name', ['id', 'churchId']],
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

router.get('/users/:userId', certify, async (req, res, next) => {
    try {
        const parsedId = req.params.userId.toString();
        const user = await db.User.findOne({
            where: {
                id: parsedId,
            },
            attributes: ['firstName', 'lastName', 'email', 'id', 'churchId', 'expoPushToken'],
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

router.post('/users', certify, async (req: Request, res: Response, next) => {
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
        if (!validateEmail(req.body.email)) {
            return res.status(406).send({ message: 'Invalid email' });
        }
        if (!doesUserExist) {
            await db.User.create({
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

            const [message, status] = sendVerEmail(username, req.headers, token, 'confirmation');

            res.status(status).json(addedUser);
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

router.delete('/users/:userId', certify, async (req: Request, res: Response, next) => {
    try {
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

// updates expoPushToken on login, may need cleanup or be moved around
router.patch('/users/expoPushToken/:userId', certify, async (req: Request, res: Response, next) => {
    try {
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
});
