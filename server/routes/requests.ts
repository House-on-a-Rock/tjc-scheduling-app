import express, { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { certify, determineLoginId } from '../utilities/helperFunctions';
import db from '../index';

const router = express.Router();

module.exports = router;
const determineMessageStatus: (arg1, arg2, arg3) => [string, number] = (request, accepted, approved) => {
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

router.get('/requests', certify, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loggedInId: number = determineLoginId(req.headers.authorization);
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
        return requests.length > 0
            ? res.status(200).json(requests)
            : res.status(404).send({ message: 'Swap requests not found' });
    } catch (err) {
        next(err);
        return res.status(503).send({ message: 'Server error, try again later' });
    }
});

router.get('/requests/:requestId', certify, async (req: Request, res: Response, next: NextFunction) => {
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

router.post('/requests', certify, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { requesteeTaskId, requesterTaskId, message } = req.body;
        const { authorization } = req.headers;

        const requesteeTask = await db.Task.findOne({ where: { id: requesteeTaskId } });
        const { userId: requesteeUserId } = await db.UserRole.findOne({ where: { id: requesteeTask.userRoleId } });

        const requesterTask = await db.Task.findOne({ where: { id: requesterTaskId } });
        const { userId: myUserId } = await db.UserRole.findOne({ where: { id: requesterTask.userRoleId } });

        if (!requesterTask) res.status(404).send({ message: 'Task not found' });
        await requesterTask.update({ status: 'changeRequested' });

        const request = await db.Request.create({
            requesteeUserId,
            message,
            type: requesteeTaskId ? 'requestOne' : 'requestAll',
            taskId: requesterTaskId,
            replace: req.query.replace === 'true',
            userId: determineLoginId(authorization),
        });
        postNotification(request.id, myUserId, 'created', message, authorization);
        return res.status(201).json(request);
    } catch (err) {
        next(err);
        return res.status(503).send({ message: 'Server error, try again later' });
    }
});

router.patch('/requests/accept/:requestId', certify, async (req: Request, res: Response, next: NextFunction) => {
    try {
        // need to test acceptingUserId w/ requesteeUserId
        const { authorization } = req.headers;
        const acceptingUserId = parseInt(jwt.decode(authorization, { json: true }).sub.split('|')[1], 10);
        const request = await db.Request.findOne({
            where: { id: req.params.requestId },
            attributes: ['id', 'requesteeUserId', 'type', 'accepted', 'approved', 'replace'],
            include: [{ model: db.Task, as: 'task', attributes: ['id', 'userRoleId'] }],
        });
        const { accepted, approved, type, task, id: requestId } = request;
        const { userId } = await db.UserRole.findOne({ where: { id: task.userRoleId } });
        const [message, status] = determineMessageStatus(request, accepted, approved);

        if (status === 202) {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            type === 'requestAll'
                ? await request.update({ requestId, accepted: true, requesteeUserId: acceptingUserId })
                : await request.update({ requestId, accepted: true });
            postNotification(requestId, userId, 'accepted', message, authorization);
        }

        return status === 202 ? res.status(status).json(request) : res.status(status).send({ message });
    } catch (err) {
        next(err);
        return res.status(503).send({ message: 'Server error, try again later' });
    }
});

router.patch('/requests/approve/:requestId', certify, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = await db.Request.findOne({
            where: { id: req.params.requestId },
            attributes: ['id', 'requesteeUserId', 'type', 'accepted', 'approved', 'replace'],
            include: [{ model: db.Task, as: 'task', attributes: ['id', 'userId'] }],
        });
        const { accepted, approved, task, id: requestId } = request;
        const { userId } = await db.UserRole.findOne({ where: { id: task.userRoleId } });
        const [message, status] = determineMessageStatus(request, accepted, approved);

        // does this need to test for requestAll?
        if (status === 202 && !approved && accepted) {
            await request.update({ id: requestId, approved: true });
            postNotification(requestId, userId, 'approved', message, req.headers.authorization);
        }
        return status === 202 ? res.status(status).json(request) : res.status(status).send({ message });
    } catch (err) {
        next(err);
        return res.status(503).send({ message: 'Server error, try again later' });
    }
});

router.patch('/requests/accept/:requestId', certify, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authorization } = req.headers;
        const acceptingUserId = jwt.decode(authorization, { json: true }).sub.split('|')[1];
        const request = await db.Request.findOne({
            where: { id: req.params.requestId },
            attributes: ['id', 'requesteeUserId', 'type', 'accepted', 'approved', 'replace'],
            include: [
                {
                    model: db.Task,
                    as: 'task',
                    attributes: ['id', 'userId'],
                },
            ],
        });
        const { accepted, approved, task, id, type } = request || {};
        const { userId } = await db.UserRole.findOne({ where: { id: task.userRoleId } });
        const [message, status] = determineMessageStatus(request, accepted, approved);
        if (status === 202) {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            type === 'requestAll'
                ? await request.update({ id, accepted: true, requesteeUserId: acceptingUserId })
                : await request.update({ id, accepted: true });
            postNotification(id, userId, 'accepted', message, authorization);
        }
        return status === 202 ? res.status(status).json(request) : res.status(status).send({ message });
    } catch (err) {
        next(err);
        return res.status(503).send({ message: 'Server error, try again later' });
    }
});
router.delete('/requests/:requestId', certify, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = await db.Request.findOne({
            where: { id: req.params.requestId },
            attributes: ['id', 'requesteeUserId', 'type', 'accepted', 'approved', 'taskId'],
        });
        return request ? res.status(200) : res.status(404).send({ message: 'Swap request not found' });
    } catch (err) {
        next(err);
        return res.status(503).send({ message: 'Server error, try again later' });
    }
});
