import express, { Request, Response, NextFunction } from 'express';
import Sequelize from 'sequelize';
import axios from 'axios';
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

router.get('/swap-requests', async (req: Request, res: Response, next: NextFunction) => {
    try {
        jwt.verify(req.headers.authorization, cert);
        const searchParams: number[] = [];
        req.query.taskId
            .toString()
            .split(',')
            .map((taskId) => {
                searchParams.push(parseInt(taskId, 10));
            });
        console.log(searchParams);
        const swapRequests = await db.SwapRequest.findAll({
            where: {
                TaskId: {
                    [Op.or]: searchParams,
                },
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
            ],
        });
        switch (swapRequests.length) {
            case 0:
                res.status(404).send({ message: 'Swap requests not found' });
                break;
            case 1:
                res.status(200).json(swapRequests[0]);
                break;
            default:
                res.status(200).json(swapRequests);
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

router.get(
    '/swap-requests/:requestId',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            jwt.verify(req.headers.authorization, cert);
            const swapRequest = await db.SwapRequest.findOne({
                where: { id: req.params.requestId },
                attributes: ['id', 'requesteeUserId', 'type', 'accepted', 'taskId'],
            });

            if (swapRequest) res.json(swapRequest);
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

router.post('/swap-requests', async (req: Request, res: Response, next: NextFunction) => {
    try {
        jwt.verify(req.headers.authorization, cert);
        let requesteeUserId: number = null;
        let type = 'requestAll';
        if (req.body.targetTaskId) {
            type = 'requestOne';
            const targetTask = await db.Task.findOne({
                where: { id: req.body.targetTaskId },
                attributes: ['userId'],
            });
            requesteeUserId = targetTask.userId;
        }
        const doesMyTaskExist = await db.Task.findOne({
            where: { id: req.body.myTaskId },
        });
        if (doesMyTaskExist) {
            const createRequest = await db.SwapRequest.create({
                requesteeUserId: requesteeUserId,
                type: type,
                taskId: req.body.myTaskId,
                message: req.body.message,
            });
            const newRequest = await db.SwapRequest.findOne({
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
                    `${process.env.SECRET_IP}api/swap-notifications`,
                    {
                        requestId: request.id,
                        userId: request.task.userId,
                        notification: 'created',
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

router.patch(
    '/swap-requests/accept/:requestId',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            jwt.verify(req.headers.authorization, cert);
            const decodedToken = jwt.decode(req.headers.authorization, { json: true });
            const acceptingUserId = decodedToken.sub.split('|')[1];
            const swapRequest = await db.SwapRequest.findOne({
                where: { id: req.params.requestId },
                attributes: ['id', 'requesteeUserId', 'type', 'accepted', 'approved'],
                include: [
                    {
                        model: db.Task,
                        as: 'task',
                        attributes: ['id', 'userId'],
                    },
                ],
            });
            if (!swapRequest) res.status(404).send({ message: 'Swap request not found' });
            if (
                !swapRequest.accepted &&
                !swapRequest.approved &&
                swapRequest.type === 'requestAll'
            ) {
                swapRequest
                    .update({
                        id: swapRequest.id,
                        accepted: true,
                        requesteeUserId: acceptingUserId,
                    })
                    .then(() => {
                        axios.post(
                            `${process.env.SECRET_IP}api/swap-notifications`,
                            {
                                requestId: swapRequest.id,
                                userId: swapRequest.task.userId,
                                notification: 'accepted',
                            },
                            { headers: { authorization: req.headers.authorization } },
                        );
                    });

                res.status(202).json(swapRequest);
            } else if (
                !swapRequest.accepted &&
                !swapRequest.approved &&
                swapRequest.type === 'requestOne' &&
                acceptingUserId === swapRequest.requesteeUserId.toString()
            ) {
                swapRequest
                    .update({
                        id: swapRequest.id,
                        accepted: true,
                    })
                    .then(() => {
                        axios.post(
                            `${process.env.SECRET_IP}api/swap-notifications`,
                            {
                                requestId: swapRequest.id,
                                userId: swapRequest.task.userId,
                                notification: 'accepted',
                            },
                            { headers: { authorization: req.headers.authorization } },
                        );
                    });
                res.status(202).json(swapRequest);
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
    },
);

router.patch(
    '/swap-requests/approve/:requestId',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            jwt.verify(req.headers.authorization, cert);
            // const decodedToken = jwt.decode(req.headers.authorization, { json: true });
            const swapRequest = await db.SwapRequest.findOne({
                where: { id: req.params.requestId },
                attributes: ['id', 'requesteeUserId', 'type', 'accepted', 'approved'],
                include: [
                    {
                        model: db.Task,
                        as: 'task',
                        attributes: ['id', 'userId'],
                    },
                ],
            });
            if (!swapRequest) res.status(404).send({ message: 'Swap request not found' });
            if (!swapRequest.approved && swapRequest.accepted) {
                swapRequest
                    .update({
                        id: swapRequest.id,
                        approved: true,
                    })
                    .then(() => {
                        axios.post(
                            `${process.env.SECRET_IP}api/swap-notifications`,
                            {
                                requestId: swapRequest.id,
                                userId: swapRequest.task.userId,
                                notification: 'approved',
                            },
                            { headers: { authorization: req.headers.authorization } },
                        );
                    });
                res.status(200).json(swapRequest);
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
    },
);

router.patch(
    '/swap-requests/reject/:requestId',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            jwt.verify(req.headers.authorization, cert);
            // const decodedToken = jwt.decode(req.headers.authorization, { json: true });
            const swapRequest = await db.SwapRequest.findOne({
                where: { id: req.params.requestId },
                attributes: ['id', 'requesteeUserId', 'type', 'accepted', 'approved'],
                include: [
                    {
                        model: db.Task,
                        as: 'task',
                        attributes: ['id', 'userId'],
                    },
                ],
            });
            if (!swapRequest) res.status(404).send({ message: 'Swap request not found' });
            if (!swapRequest.approved && !swapRequest.accepted) {
                swapRequest
                    .update({
                        id: swapRequest.id,
                        rejected: true,
                    })
                    .then(() => {
                        axios.post(
                            `${process.env.SECRET_IP}api/swap-notifications`,
                            {
                                requestId: swapRequest.id,
                                userId: swapRequest.task.userId,
                                notification: 'cancelled',
                            },
                            { headers: { authorization: req.headers.authorization } },
                        );
                    });
                res.status(200).json(swapRequest);
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
    },
);

router.delete(
    '/swap-requests/:requestId',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            jwt.verify(req.headers.authorization, cert);
            const swapRequest = await db.SwapRequest.findOne({
                where: { id: req.params.requestId },
                attributes: [
                    'id',
                    'requesteeUserId',
                    'type',
                    'accepted',
                    'approved',
                    'taskId',
                ],
            });
            if (swapRequest) {
                await swapRequest.destroy().then(function () {
                    res.status(200).json(swapRequest);
                });
            } else {
                res.status(404).send({ message: 'Swap request not found' });
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
