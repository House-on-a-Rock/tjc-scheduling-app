import express, { Request, Response } from 'express';
import Sequelize from 'sequelize';
import crypto from 'crypto';
import { UserInstance } from 'shared/SequelizeTypings/models';
import db from '../index';
import { certify, determineLoginId, sendVerEmail, validateEmail } from '../utilities/helperFunctions';

const router = express.Router();
const { Op } = Sequelize;

module.exports = router;

router.get('/users', certify, async (req: Request, res: Response, next) => {
    try {
        const { roleId, churchId } = req.query;
        const searchArray = [];
        if (churchId) searchArray.push({ churchId });
        if (roleId) {
            const userRoles = await db.UserRole.findAll({
                where: { roleId: roleId.toString() },
                attributes: ['userId'],
            });
            if (userRoles.length === 0) return res.status(404).send({ message: 'No users found with that role id' });
            const userIds = userRoles.map((userRole) => userRole.userId);
            searchArray.push({ id: userIds });
        }
        const searchParams = {
            [Op.and]: searchArray,
            [Op.not]: { id: determineLoginId(req.headers.authorization) },
        };
        const users = await db.User.findAll({
            where: searchParams,
            attributes: [['id', 'userId'], 'firstName', 'lastName', 'email', 'churchId', 'disabled'],
            include: [
                {
                    model: db.Church,
                    as: 'church',
                    attributes: ['name', 'id'],
                },
            ],
        });
        const firstUser = users[0];
        console.log(
            Object.keys(firstUser),
            firstUser.firstName,
            firstUser.lastName,
            firstUser.email,
            firstUser.churchId,
            firstUser.disabled,
            firstUser.church.name,
        );
        const allUsers = users.map(({ firstName, lastName, email, churchId: userChurchId, disabled, church }) => {
            return {
                firstName,
                lastName,
                email,
                churchId: userChurchId,
                disabled,
                church: church.name,
            };
        });
        return users.length > 0 ? res.status(200).json(allUsers) : res.status(404).send({ message: 'Users not found' });
    } catch (err) {
        next(err);
        return res.status(503).send({ message: 'Server error, try again later' });
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
        const refactoredUser = { ...user, church: user.church.name };
        return user ? res.status(200).json(refactoredUser) : res.status(404).send({ message: 'User not found' });
    } catch (err) {
        next(err);
        return res.status(503).send({ message: 'Server error, try again later' });
    }
});

router.post('/users', certify, async (req: Request, res: Response, next) => {
    try {
        const { email, firstName, lastName, password, churchId } = req.body;
        const token = crypto.randomBytes(16).toString('hex');
        const userExists: UserInstance = await db.User.findOne({
            where: { email },
            attributes: ['id', 'email'],
        });
        const { id }: UserInstance =
            !userExists &&
            (await db.User.create({
                firstName,
                lastName,
                email,
                password,
                churchId,
                isVerified: false,
                disabled: false,
            }));
        const addedUser =
            id &&
            (await db.User.findOne({
                where: { id },
                attributes: ['id', 'firstName', 'lastName', 'email', 'disabled'],
                include: [
                    {
                        model: db.Church,
                        as: 'church',
                        attributes: ['name'],
                    },
                ],
            }));

        if (addedUser) await db.Token.create({ userId: addedUser.id, token });

        const determineMessageStatus: () => [string, number] = () => {
            switch (true) {
                case !validateEmail(email):
                    return ['Invalid email', 406];
                case !!userExists:
                    return ['User already exists', 409];
                case !userExists:
                    sendVerEmail(email, req.headers, token, 'confirmation');
                    return ['', 200];
                default:
                    return ['', 400];
            }
        };
        const newUser = { ...addedUser, church: addedUser.church.name };
        const [message, status] = determineMessageStatus();
        return status === 200 ? res.status(status).json(newUser) : res.status(status).send({ message });
    } catch (err) {
        next(err);
        return res.status(503).send({ message: 'Server error, try again later' });
    }
});

router.delete('/users/:userId', certify, async (req: Request, res: Response, next) => {
    try {
        const user = await db.User.findOne({
            where: { id: req.params.userId },
            attributes: ['id'],
        });
        const [message, status] = user ? ['', 200] : ['User not found', 404];
        if (status === 200) await user.destroy();
        return res.status(status).send({ message });
    } catch (err) {
        next(err);
        return res.status(503).send({ message: 'Server error, try again later' });
    }
});

// updates expoPushToken on login, may need cleanup or be moved around
router.patch('/users/expoPushToken/:userId', certify, async (req: Request, res: Response, next) => {
    try {
        const user = await db.User.findOne({
            where: { id: req.params.userId },
        });
        const [message, status] = user ? ['Push Token updated', 200] : ['User not found', 404];
        if (status === 200) await user.update({ expoPushToken: req.body.pushToken });
        return res.status(status).send({ message });
    } catch (err) {
        next(err);
        return res.status(503).send({ message: 'Server error, try again later' });
    }
});
