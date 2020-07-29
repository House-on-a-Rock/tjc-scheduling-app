import express, { Request, Response, NextFunction } from 'express';
import Sequelize from 'sequelize';
import fs from 'fs';
import jwt, { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import db from '../index';

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
                attributes: ['id', 'userId', 'message', 'createdAt', 'RequestId'],
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
                            'TaskId',
                        ],
                    },
                ],
            });
            if (swapNotifications) res.status(200).json(swapNotifications);
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
            const swapRequest = await db.SwapRequest.findOne({
                where: { id: req.body.requestId },
                attributes: ['id', 'requesteeUserId', 'type', 'accepted', 'approved'],
            });
            const associatedUser = await db.User.findOne({
                where: { id: swapRequest.requesteeUserId },
                attributes: ['firstName'],
            });
            if (req.body.notification === 'accept' && swapRequest) {
                const newNotification = db.SwapNotification.create({
                    userId: req.body.userId,
                    message: `Your requested has been accepted by ${associatedUser.firstName}`,
                    RequestId: req.body.requestId,
                });
                res.status(201).json(newNotification);
            } else if (req.body.notification === 'approve' && swapRequest) {
                const newNotification = db.SwapNotification.create({
                    userId: req.body.userId,
                    message: `Your request to switch with ${associatedUser.firstName} has been approved`,
                    RequestId: req.body.requestId,
                });
                res.status(201).json(newNotification);
            } else {
                res.status(400).send({ message: 'Invalid request' });
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

router.delete(
    '/swap-notifications/:notificationId',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            jwt.verify(req.headers.authorization, cert);
            const swapNotification = await db.SwapNotification.findOne({
                where: { id: req.params.notificationId },
                attributes: ['id', 'userId', 'created', 'updatedAt', 'RequestId'],
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
