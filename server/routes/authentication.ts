import express, { Request, Response, NextFunction } from 'express';
import jwt from 'express-jwt';
import jwtAuthz from 'express-jwt-authz';
import jwksRsa from 'jwks-rsa';
import Sequelize from 'sequelize';
import db from '../index';

const router = express.Router();
const Op = Sequelize.Op;
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

router.post(
    '/authenticate',
    async (req: Request, res: Response, next: NextFunction) => {},
);

router.get(
    '/getUser',
    checkJwt,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const requestUser = (req.user as any).sub;
            const requestId = requestUser.split('|')[1];
            console.log(typeof requestId, requestId);
            console.log(typeof req.query.id, req.query.id);
            if (requestId === req.query.id) {
                console.log('Success');
                const parsedId = req.query.id.toString();
                const user = await db.User.findOne({
                    where: {
                        id: parseInt(parsedId),
                    },
                    attributes: ['firstName', 'lastName', 'email'],
                    include: [
                        {
                            model: db.Church,
                            attributes: ['name'],
                        },
                    ],
                });
                res.json(user);
            } else {
                res.status(404);
            }
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    '/getUserTasks',
    checkJwt,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const requestUser = (req.user as any).sub;
            const requestId = requestUser.split('|')[1];
            if (requestId === req.query.id) {
                const tasks = await db.Task.findAll({
                    where: {
                        UserId: req.query.id.toString(),
                        date: {
                            [Op.between]: [
                                '2020-03-07T00:00:00.000Z',
                                '2020-07-30T00:00:00.000Z',
                            ],
                        },
                    },
                    attributes: ['date'],
                    include: [
                        {
                            model: db.Role,
                            as: 'role',
                            attributes: ['name'],
                        },
                        {
                            model: db.Church,
                            as: 'church',
                            attributes: ['name'],
                        },
                    ],
                });
                res.json(tasks);
            } else {
                res.status(404);
            }
        } catch (err) {
            next(err);
        }
    },
);
