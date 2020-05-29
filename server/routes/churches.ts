import express, { Request, Response, NextFunction } from 'express';
import { ChurchInstance } from 'shared/SequelizeTypings/models';
import db from '../index';
import checkJwt from './jwt_helper_function';

const router = express.Router();

module.exports = router;

router.get(
    '/getAll',
    checkJwt,
    async (req: Request, res: Response, next: NextFunction) => {
        db.Church.findAll({
            attributes: ['name', 'address', 'description'],
        })
            .then((churches: ChurchInstance[]) => res.status(200).json(churches))
            .catch((err) => {
                res.status(500);
                next(err);
            });
    },
);

router.post(
    '/createChurch',
    checkJwt,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const church: ChurchInstance = await db.Church.create({
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
