import express from 'express';

import db from '../index';
import {
  makeMyNotificationMessage,
  certify,
  determineLoginId,
} from '../utilities/helperFunctions';

const router = express.Router();

async function sendPushNotification(userId, userPushToken, title, body) {
  const user = await db.Notification.findAll({
    where: { id: userId, isRead: false },
    attributes: ['isRead'],
  });
  const badgeNumber = user.length + 1;
  fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-Encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: userPushToken,
      data: {
        extraData: 'tsm sucks',
      },
      title: title,
      body: body,
      badge: badgeNumber,
    }),
  });
}

router.get('/notifications/:userId', certify, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const notifications = await db.Notification.findAll({
      where: { userId },
      attributes: ['id', 'userId', 'message', 'createdAt'],
      include: [
        {
          model: db.Request,
          as: 'request',
          attributes: [
            'id',
            'requesteeUserId',
            'type',
            'accepted',
            'approved',
            'createdAt',
          ],
        },
        // this is probably bugged
        {
          model: db.Task,
          as: 'task',
          attributes: ['id', 'date', 'status', 'churchId', 'userRoleId'],
        },
      ],
    });
    return notifications.length
      ? res.status(200).json(notifications)
      : res.status(404).send({ message: 'No Notifications Found' });
  } catch (err) {
    next(err);
    return res.status(503).send({ message: 'Server error, try again later' });
  }
});

router.post('/notifications', certify, async (req, res, next) => {
  try {
    const loggedInId = determineLoginId(req.headers.authorization);
    const { requestId, notification } = req.body;
    // userId isn't being used: /server/routes/requests postNotification()

    // will have to be edited, notification doesn't necessarily have to depend on request
    const request = await db.Request.findOne({
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
    const { requesteeUserId, task, type: swapRequestType } = request;
    const { id: userId } = await db.User.findOne({ where: { id: task.userId } });

    if (!notification)
      return res.status(400).send({ message: 'Invalid notification type.' });
    if (!request) return res.status(404).send({ message: 'Swap request not found' });

    // whoami
    const {
      firstName: myFirstName,
      churchId: myChurchId,
      id: myUserId,
      expoPushToken: myPushToken,
    } = await db.User.findOne({
      where: { id: userId },
      attributes: ['id', 'firstName', 'churchId', 'expoPushToken'],
    });

    // whoareyou
    const { firstName: theirFirstName } = await db.User.findOne({
      where: { id: requesteeUserId },
      attributes: ['id', 'firstName', 'expoPushToken'],
    });

    const receivers =
      notification === 'created' && swapRequestType === 'requestOne' && requesteeUserId
        ? [
            await db.User.findOne({
              where: { id: requesteeUserId },
              attributes: ['id', 'firstName', 'expoPushToken'],
            }),
          ]
        : await db.User.findAll({
            where: { churchId: myChurchId },
            attributes: ['id', 'firstName', 'expoPushToken'],
          });

    // creates notification for them
    if (notification === 'created') {
      const theirNotificationMessage =
        swapRequestType === 'requestOne'
          ? `${myFirstName} wants to switch with you`
          : `${myFirstName} requested to switch with someone. An open request has been sent out.`;
      receivers.map(async ({ id: theirId, expoPushToken }) => {
        if (theirId && theirId !== loggedInId && expoPushToken) {
          await db.Notification.create({
            userId: theirId,
            message: theirNotificationMessage,
            requestId,
          });
          sendPushNotification(
            theirId,
            expoPushToken,
            'Request Notification',
            theirNotificationMessage,
          );
        }
      });
    }
    // is made if requesteeUser
    const myNotificationMessage = makeMyNotificationMessage(
      notification,
      swapRequestType,
      theirFirstName,
    );
    // creates notification for me
    await db.Notification.create({
      userId: myUserId,
      message: myNotificationMessage,
      requestId,
    });
    sendPushNotification(
      myUserId,
      myPushToken,
      'Request Notification',
      myNotificationMessage,
    );
    return res.status(201).send({ message: 'Notifications created' });
  } catch (err) {
    next(err);
    return res.status(503).send({ message: 'Server error, try again later' });
  }
});

router.patch('/notifications/:notificationId', certify, async (req, res, next) => {
  try {
    const notification = await db.Notification.findOne({
      where: { id: req.params.notificationId },
      attributes: ['id', 'userId', 'createdAt', 'isRead', 'updatedAt', 'requestId'],
    });
    if (!notification) return res.status(404).send({ message: 'Notification not found' });
    const data = await notification.update({
      id: notification.id,
      isRead: true,
    });
    return res.status(200).json(data);
  } catch (err) {
    next(err);
    return res.status(503).send({ message: 'Server error, try again later' });
  }
});

router.patch('/notifications/read-all/:userId', certify, async (req, res, next) => {
  try {
    const notifications = await db.Notification.findAll({
      where: { userId: req.params.userId },
      attributes: ['id', 'userId', 'createdAt', 'isRead', 'updatedAt', 'requestId'],
    });
    if (!notifications)
      return res.status(404).send({ message: 'Notifications not found' });
    const data = notifications.map((notification) =>
      notification.update({ isRead: true }),
    );
    return res.status(200).json(data);
  } catch (err) {
    next(err);
    return res.status(503).send({ message: 'Server error, try again later' });
  }
});

router.delete('/notifications/:notificationId', certify, async (req, res, next) => {
  try {
    const notification = await db.Notification.findOne({
      where: { id: req.params.notificationId },
      attributes: ['id', 'userId', 'createdAt', 'updatedAt', 'requestId'],
    });
    const [message, status] = notification ? ['', 200] : ['Notification not found', 404];
    await notification?.destroy();
    return res.status(status).send({ message });
  } catch (err) {
    next(err);
    return res.status(503).send({ message: 'Server error, try again later' });
  }
});

export default router;
