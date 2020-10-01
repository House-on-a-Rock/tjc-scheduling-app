import express, { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import jwt, { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { certify, determineLoginId } from '../utilities/helperFunctions';
import db from '../index';

const router = express.Router();

module.exports = router;

router.get('/requests', certify, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loggedInId: number = determineLoginId(req.headers.authorization);
        const requests = await db.Request.findAll({
            where: {
                userId: loggedInId,
                approved: false,
            },
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
        switch (requests.length) {
            case 0:
                res.status(404).send({ message: 'Swap requests not found' });
                break;
            case 1:
                res.status(200).json(requests[0]);
                break;
            default:
                res.status(200).json(requests);
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

router.get('/requests/:requestId', certify, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = await db.Request.findOne({
            where: { id: req.params.requestId },
            attributes: ['id', 'requesteeUserId', 'type', 'accepted', 'taskId'],
        });

        if (request) res.json(request);
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

router.post('/requests', certify, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loggedInId: number = determineLoginId(req.headers.authorization);
        let requesteeUserId: number = null;
        let type = 'requestAll';
        let isReplace = false;
        if (req.query.replace === 'true') isReplace = true;
        if (req.body.targetTaskId) {
            type = 'requestOne';
            const targetTask = await db.Task.findOne({
                where: { id: req.body.targetTaskId },
                attributes: ['userId'],
            });
            requesteeUserId = targetTask.userId;
        }
        const myTask = await db.Task.findOne({
            where: { id: req.body.myTaskId },
        });
        if (myTask) {
            const createRequest = await db.Request.create({
                requesteeUserId: requesteeUserId,
                type: type,
                taskId: req.body.myTaskId,
                message: req.body.message,
                replace: isReplace,
                userId: loggedInId,
            });
            myTask.update({
                status: 'changeRequested',
            });
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
            res.status(201).json(newRequest);
        } else {
            res.status(404).send({ message: 'Task not found' });
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
        if (err instanceof TokenExpiredError || err instanceof JsonWebTokenError) {
            res.status(401).send({ message: 'Unauthorized' });
        } else {
            res.status(503).send({ message: 'Server error, try again later' });
        }
        next(err);
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
        if (err instanceof TokenExpiredError || err instanceof JsonWebTokenError) {
            res.status(401).send({ message: 'Unauthorized' });
        } else {
            res.status(503).send({ message: 'Server error, try again later' });
        }
        next(err);
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
        if (err instanceof TokenExpiredError || err instanceof JsonWebTokenError) {
            res.status(401).send({ message: 'Unauthorized' });
        } else {
            res.status(503).send({ message: 'Server error, try again later' });
        }
        next(err);
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
        if (err instanceof TokenExpiredError || err instanceof JsonWebTokenError) {
            res.status(401).send({ message: 'Unauthorized' });
        } else {
            res.status(503).send({ message: 'Server error, try again later' });
        }
        next(err);
    }
});
