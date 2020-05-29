import express, { Request, Response } from 'express';
import jwtAuthz from 'express-jwt-authz';
import { UserInstance } from 'shared/SequelizeTypings/models';
import db from '../index';
import checkJwt from './jwt_helper_function';

const router = express.Router();

module.exports = router;

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
