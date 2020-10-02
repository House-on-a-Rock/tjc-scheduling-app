import express, { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { certify, determineLoginId } from '../utilities/helperFunctions';
import db from '../index';

const router = express.Router();

module.exports = router;

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
        const request = await db.Request.findOne({
            where: { id: req.params.requestId },
            attributes: ['id', 'requesteeUserId', 'type', 'accepted', 'taskId'],
        });
        return request ? res.json(request) : res.status(404).send({ message: 'Not Found' });
    } catch (err) {
        next(err);
        return res.status(503).send({ message: 'Server error, try again later' });
    }
});

router.post(
    '/requests',
    //  certify,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { targetTaskId, myTaskId, message } = req.body;
            console.log(req.body);
            console.log(targetTaskId, myTaskId, message);
            const { authorization } = req.headers;
            const loggedInId: number = determineLoginId(authorization);
            const type = targetTaskId ? 'requestOne' : 'requestAll';
            const shouldReplace = req.query.replace === 'true';
            const { userId: requesteeUserId } =
                (await db.Task.findOne({ where: { id: targetTaskId }, attributes: ['userId'] })) || {};
            console.log('requesteeUserId', requesteeUserId);
            const myTask = await db.Task.findOne({ where: { id: myTaskId } });
            console.log('myTask', myTask, '\n\n\n');

            if (!myTask) res.status(404).send({ message: 'Task not found' });

            myTask.update({ status: 'changeRequested' });
            const createRequest = await db.Request.create({
                requesteeUserId,
                type,
                message,
                taskId: myTaskId,
                replace: shouldReplace,
                userId: loggedInId,
            });
            console.log('createRequest', createRequest, '\n\n\n');
            // const request = await db.Request.findOne({
            //     where: { id: createRequest.id },
            //     include: [{ model: db.Task, as: 'task', attributes: ['id', 'userId'] }],
            // });

            const newRequest = await db.Request.findOne({
                where: { id: createRequest.id },
                include: [
                    {
                        model: db.Task,
                        as: 'task',
                        attributes: ['id', 'userId'],
                    },
                ],
            }).then(async (request) => {
                console.log('request', request);
                await axios.post(
                    `${process.env.SECRET_IP}api/notifications`,
                    {
                        requestId: request.id,
                        userId: request.task.userId,
                        notification: 'created',
                        message: req.body.message,
                    },
                    { headers: { authorization: req.headers.authorization } },
                );
            });
            console.log(
                'request',
                newRequest,
                '\n\n\n',
                process.env.SECRET_IP,
                `${process.env.SECRET_IP}api/notifications`,
            );
            res.status(201).json(newRequest);
            // console.log('notification', notification);
            // return res.status(201).json(request);
        } catch (err) {
            next(err);
            return res.status(503).send({ message: 'Server error, try again later' });
        }
    },
);

router.patch('/requests/accept/:requestId', certify, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const decodedToken = jwt.decode(req.headers.authorization, { json: true });
        const acceptingUserId = decodedToken.sub.split('|')[1];
        const request = await db.Request.findOne({
            where: { id: req.params.requestId },
            attributes: ['id', 'requesteeUserId', 'type', 'accepted', 'approved', 'replace'],
            include: [{ model: db.Task, as: 'task', attributes: ['id', 'userId'] }],
        });
        if (!request) res.status(404).send({ message: 'Swap request not found' });
        if (!request.accepted && !request.approved && request.type === 'requestAll') {
            request.update({ id: request.id, accepted: true, requesteeUserId: acceptingUserId }).then(() => {
                axios.post(
                    `${process.env.SECRET_IP}api/notifications`,
                    { requestId: request.id, userId: request.task.userId, notification: 'accepted' },
                    { headers: { authorization: req.headers.authorization } },
                );
            });

            res.status(202).json(request);
        } else if (
            !request.accepted &&
            !request.approved &&
            request.type === 'requestOne' &&
            acceptingUserId === request.requesteeUserId.toString()
        ) {
            request.update({ id: request.id, accepted: true }).then(() => {
                axios.post(
                    `${process.env.SECRET_IP}api/notifications`,
                    { requestId: request.id, userId: request.task.userId, notification: 'accepted' },
                    { headers: { authorization: req.headers.authorization } },
                );
            });
            res.status(202).json(request);
        } else {
            res.status(400).send({ message: 'Invalid Request' });
        }
    } catch (err) {
        next(err);
        return res.status(503).send({ message: 'Server error, try again later' });
    }
});

router.patch('/requests/approve/:requestId', certify, async (req: Request, res: Response, next: NextFunction) => {
    try {
        // const decodedToken = jwt.decode(req.headers.authorization, { json: true });
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
        if (!request) res.status(404).send({ message: 'Swap request not found' });
        if (!request.approved && request.accepted) {
            request
                .update({
                    id: request.id,
                    approved: true,
                })
                .then(() => {
                    axios.post(
                        `${process.env.SECRET_IP}api/notifications`,
                        {
                            requestId: request.id,
                            userId: request.task.userId,
                            notification: 'approved',
                        },
                        { headers: { authorization: req.headers.authorization } },
                    );
                });
            res.status(200).json(request);
        } else {
            res.status(400).send({ message: 'Invalid Request' });
        }
    } catch (err) {
        next(err);
        return res.status(503).send({ message: 'Server error, try again later' });
    }
});

router.patch('/requests/accept/:requestId', certify, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const decodedToken = jwt.decode(req.headers.authorization, { json: true });
        const acceptingUserId = decodedToken.sub.split('|')[1];
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
        if (!request) res.status(404).send({ message: 'Swap request not found' });
        if (!request.accepted && !request.approved && request.type === 'requestAll') {
            request
                .update({
                    id: request.id,
                    accepted: true,
                    requesteeUserId: acceptingUserId,
                })
                .then(() => {
                    axios.post(
                        `${process.env.SECRET_IP}api/notifications`,
                        {
                            requestId: request.id,
                            userId: request.task.userId,
                            notification: 'accepted',
                        },
                        { headers: { authorization: req.headers.authorization } },
                    );
                });

            res.status(202).json(request);
        } else if (
            !request.accepted &&
            !request.approved &&
            request.type === 'requestOne' &&
            acceptingUserId === request.requesteeUserId.toString()
        ) {
            request
                .update({
                    id: request.id,
                    accepted: true,
                })
                .then(() => {
                    axios.post(
                        `${process.env.SECRET_IP}api/notifications`,
                        {
                            requestId: request.id,
                            userId: request.task.userId,
                            notification: 'accepted',
                        },
                        { headers: { authorization: req.headers.authorization } },
                    );
                });
            res.status(202).json(request);
        } else {
            res.status(400).send({ message: 'Invalid Request' });
        }
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
