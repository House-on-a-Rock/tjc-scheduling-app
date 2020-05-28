import express, { Request, Response } from 'express';
import jwt from 'express-jwt';
import jwtAuthz from 'express-jwt-authz';
import jwksRsa from 'jwks-rsa';
import { UserInstance } from 'shared/SequelizeTypings/models';
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

const checkScopes = jwtAuthz(['read:AllUsers']);

router.get(
    '/getAllUsers',
    checkJwt,
    checkScopes,
    async (req: Request, res: Response, next) => {
        try {
            const users: UserInstance[] = await db.User.findAll({
                attributes: ['firstName', 'lastName', 'email', 'ChurchId'],
            });
            res.status(200).json(users);
        } catch (err) {
            next(err);
        }
    },
);

// router.get('/getUser', async (req, res, next) => {
//     try {
//         const user = await db.User.findOne({
//             where: {
//                 id: req.query.id,
//             },
//             attributes: ['firstName', 'lastName', 'email'],
//         });
//         res.json(user);
//     } catch (err) {
//         next(err);
//     }
// });
