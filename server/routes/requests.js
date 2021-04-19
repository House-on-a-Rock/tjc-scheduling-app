import express from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { certify, determineLoginId } from '../utilities/helperFunctions';
import db from '../index';

const router = express.Router();

module.exports = router;
const determineMessageStatus = (request, accepted, approved) => {
  switch (true) {
    case !request:
      return ['Swap request not found', 404];
    case !accepted && !approved:
      return ['', 202];
    default:
      return ['Invalid Request', 400];
  }
};

const postNotification = (requestId, userId, notification, message, authorization) =>
  axios.post(
    `${process.env.SECRET_IP}api/notifications`,
    { requestId, userId, notification, message },
    { headers: { authorization } },
  );

const getUsersFromRole = (roleId, authorization) =>
  axios.get(`${process.env.SECRET_IP}api/users?roleId=${roleId}`, {
    headers: authorization,
  });

router.get('/requests', certify, async (req, res, next) => {
  try {
    const loggedInId = determineLoginId(req.headers.authorization);
    const requests = await db.Request.findAll({
      where: { userId: loggedInId, approved: false },
      attributes: [
        ['id', 'requestId'],
        'requesteeUserId',
        'type',
        'accepted',
        'approved',
        'createdAt',
        'taskId',
        'message',
        'replace',
      ],
    });
    return requests.length
      ? res.status(200).json(requests)
      : res.status(404).send({ message: 'Swap requests not found' });
  } catch (err) {
    next(err);
    return res.status(503).send({ message: 'Server error, try again later' });
  }
});

router.get('/requests/:requestId', certify, async (req, res, next) => {
  try {
    const { requestId: id } = req.params;
    const request = await db.Request.findOne({
      where: { id },
      attributes: ['id', 'requesteeUserId', 'type', 'accepted', 'taskId'],
    });
    return request ? res.json(request) : res.status(404).send({ message: 'Not Found' });
  } catch (err) {
    next(err);
    return res.status(503).send({ message: 'Server error, try again later' });
  }
});

router.post('/requests', certify, async (req, res, next) => {
  try {
    // requester is the one asking others for a switch
    // requestee are the ones being asked for a switch
    // if type === requestOne, requesterTaskId === null
    const { requesteeTaskId, requesterTaskId, message, type } = req.body;
    const { authorization = '' } = req.headers;

    // requester logic
    const requesterTask = await db.Task.findOne({ where: { id: requesterTaskId } });
    if (!requesterTask) res.status(404).send({ message: 'Task not found' });
    const { id: myUserId } = await db.User.findOne({
      where: { id: requesterTask.userId },
    });
    const { roleId } = await db.Event.findOne({ where: { id: requesterTask.eventId } });
    await requesterTask.update({ status: 'changeRequested' });

    // requestee logic
    let request = [];
    if (type === 'requestOne') {
      const requesteeTask = await db.Task.findOne({ where: { id: requesteeTaskId } });
      const { id: requesteeUserId } = await db.User.findOne({
        where: { id: requesteeTask.userId },
      });

      request = [
        await db.Request.create({
          requesteeUserId,
          message,
          type: 'requestOne',
          taskId: requesterTaskId,
          replace: req.query.replace === 'true',
          userId: determineLoginId(authorization),
        }),
      ];

      postNotification(request[0].id, myUserId, 'created', message, authorization);
    }

    if (type === 'requestAll') {
      const { data: users } = await getUsersFromRole(roleId, authorization);
      const requests = users.map((user) => {
        return {
          requesteeUserId: user.id,
          message,
          type: 'requestAll',
          taskId: requesterTaskId,
          replace: req.query.replace === 'true',
          userId: determineLoginId(authorization),
        };
      });
      request = await db.Request.bulkCreate(requests);
      request.map(({ id }) =>
        postNotification(id, myUserId, 'created', message, authorization),
      );
    }

    return res.status(201).json(request);
  } catch (err) {
    next(err);
    return res.status(503).send({ message: 'Server error, try again later' });
  }
});

router.patch('/requests/accept/:requestId', certify, async (req, res, next) => {
  try {
    // need to test acceptingUserId w/ requesteeUserId
    const { authorization = '' } = req.headers;
    const acceptingUserId = parseInt(
      jwt.decode(authorization, { json: true })?.sub.split('|')[1],
      10,
    );
    const request = await db.Request.findOne({
      where: { id: req.params.requestId },
      attributes: ['id', 'requesteeUserId', 'type', 'accepted', 'approved', 'replace'],
      include: [{ model: db.Task, as: 'task', attributes: ['id', 'userRoleId'] }],
    });
    const { accepted, approved, type, task, id: requestId } = request;
    const { id: userId } = await db.User.findOne({ where: { id: task.userId } });
    const [message, status] = determineMessageStatus(request, accepted, approved);

    if (status === 202) {
      type === 'requestAll'
        ? await request.update({
            requestId,
            accepted: true,
            requesteeUserId: acceptingUserId,
          })
        : await request.update({ requestId, accepted: true });
      postNotification(requestId, userId, 'accepted', message, authorization);
    }

    return status === 202
      ? res.status(status).json(request)
      : res.status(status).send({ message });
  } catch (err) {
    next(err);
    return res.status(503).send({ message: 'Server error, try again later' });
  }
});

router.patch('/requests/approve/:requestId', certify, async (req, res, next) => {
  try {
    const { authorization = '' } = req.headers;
    const request = await db.Request.findOne({
      where: { id: req.params.requestId },
      attributes: ['id', 'requesteeUserId', 'type', 'accepted', 'approved', 'replace'],
      include: [{ model: db.Task, as: 'task', attributes: ['id', 'userId'] }],
    });
    const { accepted, approved, task, id: requestId } = request;
    const { id: userId } = await db.User.findOne({ where: { id: task.userId } });
    const [message, status] = determineMessageStatus(request, accepted, approved);

    // does this need to test for requestAll?
    if (status === 202 && !approved && accepted) {
      await request.update({ id: requestId, approved: true });
      postNotification(requestId, userId, 'approved', message, authorization);
    }
    return status === 202
      ? res.status(status).json(request)
      : res.status(status).send({ message });
  } catch (err) {
    next(err);
    return res.status(503).send({ message: 'Server error, try again later' });
  }
});

router.patch('/requests/reject/:requestId', async (req, res, next) => {
  try {
    const { authorization = '' } = req.headers;
    const request = await db.Request.findOne({
      where: { id: req.params.requestId },
      attributes: ['id', 'requesteeUserId', 'type', 'accepted', 'approved'],
      include: [{ model: db.Task, as: 'task', attributes: ['id', 'userId'] }],
    });
    const { accepted, approved } = request;
    const [message, status] = determineMessageStatus(request, accepted, approved);
    if (status === 202) {
      await request.update({ id: request.id, rejected: true });
      postNotification(
        request.id,
        request.task.userId,
        'cancelled',
        message,
        authorization,
      );
      return res.status(200).json(request);
    }
    return res.status(status).send({ message });
  } catch (err) {
    next(err);
    return res.status(503).send({ message: 'Server error, try again later' });
  }
});

router.delete('/requests/:requestId', certify, async (req, res, next) => {
  try {
    const request = await db.Request.findOne({
      where: { id: req.params.requestId },
      attributes: ['id', 'requesteeUserId', 'type', 'accepted', 'approved', 'taskId'],
    });
    return request
      ? res.status(200)
      : res.status(404).send({ message: 'Swap request not found' });
  } catch (err) {
    next(err);
    return res.status(503).send({ message: 'Server error, try again later' });
  }
});
