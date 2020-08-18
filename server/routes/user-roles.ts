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
    '/user-roles/:userId',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            jwt.verify(req.headers.authorization, cert);
            const userRoles = await db.UserRole.findAll({
                where: { UserId: req.params.userId.toString() },
                attributes: ['roleId'],
                include: [
                    {
                        model: db.Role,
                        as: 'role',
                        attributes: ['name'],
                    },
                ],
            });
            if (userRoles) res.status(200).json(userRoles);
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
