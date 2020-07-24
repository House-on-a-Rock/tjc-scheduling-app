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
    '/swap-request/:requestId',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            jwt.verify(req.headers.authorization, cert);
            const swapRequest = await db.SwapRequest.findOne({
                where: { id: req.params.requestId },
                attributes: ['id', 'requesteeUserId', 'type', 'accepted', 'TaskId'],
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

router.post('/swap-request', async (req: Request, res: Response, next: NextFunction) => {
    try {
        jwt.verify(req.headers.authorization, cert);
        let requesteeUserId: number = null;
        let type = 'requestAll';
        if (req.body.switchWithId) {
            requesteeUserId = parseInt(req.body.switchWithId, 10);
            type = 'requestOne';
        }
        const doesTaskExist = await db.Task.findOne({
            where: { id: req.body.taskId },
        });
        if (doesTaskExist) {
            const newRequest = await db.SwapRequest.create({
                requesteeUserId: requesteeUserId,
                type: type,
                taskId: req.body.taskId,
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
    '/swap-request/accept/:requestId',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            jwt.verify(req.headers.authorization, cert);
            const decodedToken = jwt.decode(req.headers.authorization, { json: true });
            const requesterId = decodedToken.sub.split('|')[1];
            const swapRequest = await db.SwapRequest.findOne({
                where: { id: req.params.requestId },
                attributes: [
                    'id',
                    'requesteeUserId',
                    'type',
                    'accepted',
                    'approved',
                    'TaskId',
                ],
            });
            if (!swapRequest) res.status(404).send({ message: 'Swap request not found' });
            if (
                !swapRequest.accepted &&
                !swapRequest.approved &&
                swapRequest.type === 'requestAll'
            ) {
                swapRequest.update({
                    id: swapRequest.id,
                    accepted: true,
                    requesteeUserId: requesterId,
                });
                res.status(202).json(swapRequest);
            } else if (
                !swapRequest.accepted &&
                !swapRequest.approved &&
                swapRequest.type === 'requestOne' &&
                requesterId === swapRequest.requesteeUserId
            ) {
                swapRequest.update({
                    id: swapRequest.id,
                    accepted: true,
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
    '/swap-request/approve/:requestId',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            jwt.verify(req.headers.authorization, cert);
            // const decodedToken = jwt.decode(req.headers.authorization, { json: true });
            const swapRequest = await db.SwapRequest.findOne({
                where: { id: req.params.requestId },
                attributes: [
                    'id',
                    'requesteeUserId',
                    'type',
                    'accepted',
                    'approved',
                    'TaskId',
                ],
            });
            if (!swapRequest) res.status(404).send({ message: 'Swap request not found' });
            if (!swapRequest.approved && swapRequest.accepted) {
                swapRequest.update({
                    id: swapRequest.id,
                    approved: true,
                });
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
    '/swap-request/:requestId',
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
                    'TaskId',
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
