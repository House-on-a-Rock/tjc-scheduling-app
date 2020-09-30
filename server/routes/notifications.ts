import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import jwt, { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { RequestInstance, UserInstance } from 'shared/SequelizeTypings/models';
import db from '../index';
import helper from '../helper_functions';

const router = express.Router();
let cert;
fs.readFile('tjcschedule_pub.pem', function read(err, data) {
    if (err) throw err;
    cert = data;
});
module.exports = router;

router.get('/notifications/:userId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authorization } = req.headers;
        const { userId } = req.params;
        jwt.verify(authorization, cert);
        const notifications = await db.Notification.findAll({
            where: { userId },
            attributes: ['id', 'userId', 'message', 'createdAt', 'requestId'],
            include: [
                {
                    model: db.Request,
                    as: 'request',
                    attributes: ['requesteeUserId', 'type', 'accepted', 'approved', 'createdAt', 'taskId'],
                },
                {
                    model: db.Task,
                    as: 'task',
                    attributes: ['date', 'status', 'churchId', 'userId', 'roleId'],
                },
            ],
        });
        if (notifications.length === 0) return res.status(404).send({ message: 'No notifications found' });
        return res.status(200).json(notifications);
    } catch (err) {
        next(err);
        const [message, status] =
            err instanceof TokenExpiredError || err instanceof JsonWebTokenError
                ? ['Unauthorized', 401]
                : ['Server error, try again later', 503];
        return res.send({ message }).status(status);
    }
});

router.post('/notifications', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authorization } = req.headers;
        jwt.verify(authorization, cert);
        const decodedToken = jwt.decode(authorization, { json: true });

        const { requestId, notification } = req.body;
        const loggedInId: number = parseInt(decodedToken.sub.split('|')[1], 10);

        const request: RequestInstance = await db.Request.findOne({
            where: { id: requestId },
            attributes: ['id', 'requesteeUserId', 'type', 'accepted', 'approved'],
            include: [
                {
                    model: db.Task,
                    as: 'task',
                    attributes: ['id', 'userId'],
                },
            ],
        });
        const { requesteeUserId, task, type: requestType } = request;
        // eslint-disable-next-line no-nested-ternary
        const [message, status] = !notification
            ? ['Invalid notification type.', 400]
            : !request
            ? ['Swap request not found', 404]
            : ['Notifications created', 200];
        if (status > 399) return res.status(status).send({ message });

        // whoami
        const {
            firstName: myName,
            churchId: myChurchId,
            id: myUserId,
            expoPushToken: myPushToken,
        } = await db.User.findOne({
            where: { id: task.userId },
            attributes: ['id', 'firstName', 'churchId', 'expoPushToken'],
        });

        // whoareyou
        const { firstName: theirName } =
            requesteeUserId &&
            (await db.User.findOne({
                where: { id: requesteeUserId },
                attributes: ['id', 'firstName', 'expoPushToken'],
            }));

        // creates notification for receivers
        if (notification === 'created') {
            const [theirNotifMessage, receivers]: [string, UserInstance[]] = await helper.makeTheirNotifications(
                requestType,
                myName,
                requesteeUserId ?? myChurchId,
            );

            receivers.map(async ({ id: theirId, expoPushToken: theirPushToken }) => {
                // won't send to myself
                if (theirId !== loggedInId) {
                    await db.Notification.create({
                        userId: theirId,
                        message: theirNotifMessage,
                        requestId,
                    });
                    helper.sendPushNotification(theirId, theirPushToken, 'Request Notification', theirNotifMessage);
                }
            });
        }
        // creates notification for me
        const myNotifMessage: string = helper.makeMyNotification(notification, requestType, theirName);
        await db.Notification.create({
            userId: myUserId,
            message: myNotifMessage,
            requestId,
        });
        helper.sendPushNotification(myUserId, myPushToken, 'Request Notification', myNotifMessage);

        return res.status(status).send({ message });
    } catch (err) {
        next(err);
        const [message, status] =
            err instanceof TokenExpiredError || err instanceof JsonWebTokenError
                ? ['Unauthorized', 401]
                : ['Server error, try again later', 503];
        return res.send({ message }).status(status);
    }
});

router.patch('/notifications/:notificationId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        jwt.verify(req.headers.authorization, cert);
        const notification = await db.Notification.findOne({
            where: { id: req.params.notificationId },
            attributes: ['id', 'userId', 'createdAt', 'isRead', 'updatedAt', 'requestId'],
        });
        notification.update({
            id: notification.id,
            isRead: true,
        });
        const [message, status] = !notification ? ['Invalid notification.', 400] : ['Notifications patched', 200];
        return res.status(status).send({ message });
    } catch (err) {
        next(err);
        const [message, status] =
            err instanceof TokenExpiredError || err instanceof JsonWebTokenError
                ? ['Unauthorized', 401]
                : ['Server error, try again later', 503];
        return res.send({ message }).status(status);
    }
});

router.patch('/notifications/read-all/:userId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        jwt.verify(req.headers.authorization, cert);
        const notifications = await db.Notification.findAll({
            where: { userId: req.params.userId },
            attributes: ['id', 'userId', 'createdAt', 'isRead', 'updatedAt', 'requestId'],
        });
        notifications.map((notification) => notification.update({ isRead: true }));
        const [message, status] = !notifications ? ['Invalid notification.', 400] : ['All notifications read', 200];
        return res.status(status).send({ message });
    } catch (err) {
        next(err);
        const [message, status] =
            err instanceof TokenExpiredError || err instanceof JsonWebTokenError
                ? ['Unauthorized', 401]
                : ['Server error, try again later', 503];
        return res.send({ message }).status(status);
    }
});

router.delete('/notifications/:notificationId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        jwt.verify(req.headers.authorization, cert);
        const notification = await db.Notification.findOne({
            where: { id: req.params.notificationId },
            attributes: ['id', 'userId', 'createdAt', 'updatedAt', 'requestId'],
        });
        if (notification) await notification.destroy();
        const [message, status] = notification ? ['Notification destroyed', 200] : ['Notification not found', 404];
        return res.status(status).send({ message });
    } catch (err) {
        next(err);
        const [message, status] =
            err instanceof TokenExpiredError || err instanceof JsonWebTokenError
                ? ['Unauthorized', 401]
                : ['Server error, try again later', 503];
        return res.send({ message }).status(status);
    }
});
