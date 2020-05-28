import express, { Request, Response, NextFunction } from 'express';
import jwt from 'express-jwt';
import jwtAuthz from 'express-jwt-authz';
import jwksRsa from 'jwks-rsa';
import db from '../index';

const router = express.Router();
module.exports = router;

const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
    }),

    audience: process.env.AUDIENCE,
    issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    algorithms: ['RS256'],
});

router.get(
    '/getAllUserTasks',
    checkJwt,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const task = await db.Task.findAll({
                where: { user: req.body.user },
            });
            res.status(200).json(task);
        } catch (err) {
            next(err);
        }
    },
);

router.post(
    '/createTask',
    checkJwt,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const task = await db.Task.create({
                date: req.body.date,
            });
            res.send(task);
        } catch (err) {
            next(err);
        }
    },
);
