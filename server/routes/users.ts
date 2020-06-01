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

router.get('/getUser', async (req, res, next) => {
    try {
        // const parsedId = req.query.id.toString();
        const user = await db.User.findOne({
            where: {
                id: '1',
                // req.query.id.toString(),
            },
            attributes: ['firstName', 'lastName', 'email', 'id'],
            include: [
                {
                    model: db.Church,
                    attributes: ['name'],
                },
            ],
        });
        res.json(user);
    } catch (err) {
        next(err);
    }
});
