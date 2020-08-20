import express, { Request, Response, NextFunction } from 'express';
import Sequelize from 'sequelize';
import fs from 'fs';
import jwt, { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
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

router.get(
    '/swap-notifications/:userId',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            jwt.verify(req.headers.authorization, cert);
            const swapNotifications = await db.SwapNotification.findAll({
                where: { userId: req.params.userId },
                attributes: ['id', 'userId', 'message', 'createdAt', 'requestId'],
                include: [
                    {
                        model: db.SwapRequest,
                        as: 'request',
                        attributes: [
                            'requesteeUserId',
                            'type',
                            'accepted',
                            'approved',
                            'createdAt',
                            'taskId',
                        ],
                    },
                ],
            });
            if (swapNotifications.length > 0) res.status(200).json(swapNotifications);
            else res.status(404).send({ message: 'Not found' });
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

router.post(
    '/swap-notifications',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            jwt.verify(req.headers.authorization, cert);
            let message = '';
            const swapRequest = await db.SwapRequest.findOne({
                where: { id: req.body.requestId },
                attributes: ['id', 'requesteeUserId', 'type', 'accepted', 'approved'],
                include: [
                    {
                        model: db.Task,
                        as: 'task',
                        attributes: ['id', 'userId'],
                    },
                ],
            });
            const requesteeUser = await db.User.findOne({
                where: { id: swapRequest.requesteeUserId },
                attributes: ['id', 'firstName', 'expoPushToken'],
            });
            const requestingUser = await db.User.findOne({
                where: { id: req.body.userId },
                attributes: ['id', 'firstName', 'churchId', 'expoPushToken'],
            });
            const localChurchUsers = await db.User.findAll({
                where: { churchId: requestingUser.churchId },
                attributes: ['id', 'firstName', 'expoPushToken'],
            });
            if (!swapRequest)
                return res.status(404).send({ message: 'Swap request not found' });
            switch (req.body.notification) {
                case 'accepted':
                    message = `Your requested has been accepted by ${requesteeUser.firstName}`;
                    break;
                case 'approved':
                    message = `Your request to switch with ${requesteeUser.firstName} has been approved`;
                    break;
                case 'cancelled':
                    message = `Your request to switch has been cancelled`;
                    break;
                case 'created':
                    if (swapRequest.type === 'requestOne') {
                        message = `Request sent to ${requesteeUser.firstName}`;
                        await db.SwapNotification.create({
                            userId: requesteeUser.id,
                            message: `${requestingUser.firstName} wants to switch with you`,
                            requestId: req.body.requestId,
                        });
                        helper.sendPushNotification(
                            requesteeUser.id,
                            requesteeUser.expoPushToken,
                            'Request Notification',
                            message,
                        );
                    } else {
                        message = `Request sent to all local church members`;
                        localChurchUsers.map(async (user) => {
                            await db.SwapNotification.create({
                                userId: user.id,
                                message: `${requestingUser.firstName} requested to switch with someone. An open request has been sent out.`,
                                requestId: req.body.requestId,
                            });
                            helper.sendPushNotification(
                                user.id,
                                user.expoPushToken,
                                'Request Notification',
                                `${requestingUser.firstName} requested to switch with someone. An open request has been sent out.`,
                            );
                        });
                    }
                    break;
                default:
                    return res
                        .status(400)
                        .send({ message: 'Invalid notification type.' });
            }
            await db.SwapNotification.create({
                userId: req.body.userId,
                message: message,
                requestId: req.body.requestId,
            });
            helper.sendPushNotification(
                req.body.userId,
                requestingUser.expoPushToken,
                'Request Notification',
                message,
            );
            res.status(201).send({ message: 'Notifications created' });
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

router.patch(
    '/swap-notifications/:notificationId',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            jwt.verify(req.headers.authorization, cert);
            const swapNotification = await db.SwapNotification.findOne({
                where: { id: req.params.notificationId },
                attributes: [
                    'id',
                    'userId',
                    'createdAt',
                    'isRead',
                    'updatedAt',
                    'requestId',
                ],
            });
            swapNotification.update({
                id: swapNotification.id,
                isRead: true,
            });
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

router.patch(
    '/swap-notifications/read-all/:userId',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            jwt.verify(req.headers.authorization, cert);
            const swapNotifications = await db.SwapNotification.findAll({
                where: { userId: req.params.userId },
                attributes: [
                    'id',
                    'userId',
                    'createdAt',
                    'isRead',
                    'updatedAt',
                    'requestId',
                ],
            });
            swapNotifications.map((swapNotification) => {
                swapNotification.update({
                    isRead: true,
                });
            });
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

router.delete(
    '/swap-notifications/:notificationId',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            jwt.verify(req.headers.authorization, cert);
            const swapNotification = await db.SwapNotification.findOne({
                where: { id: req.params.notificationId },
                attributes: ['id', 'userId', 'createdAt', 'updatedAt', 'requestId'],
            });
            if (swapNotification) {
                await swapNotification.destroy().then(function () {
                    res.status(200).json(swapNotification);
                });
            } else {
                res.status(404).send({ message: 'Notification not found' });
            }
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
