import express, { Request, Response, NextFunction } from 'express';

import db from '../index';
import checkJwt from './jwt_helper_function';

const router = express.Router();
module.exports = router;

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
