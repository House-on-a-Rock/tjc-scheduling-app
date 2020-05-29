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
    '/getAll',
    checkJwt,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const church = await db.Church.findAll({
                attributes: ['name', 'address', 'description'],
            });
            res.status(200).json(church);
        } catch (err) {
            next(err);
        }
    },
);

router.post(
    '/createChurch',
    checkJwt,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const church = await db.Church.create({
                name: req.body.name,
                address: req.body.address,
                description: req.body.description,
            });
            res.send(church);
        } catch (err) {
            next(err);
        }
    },
);
