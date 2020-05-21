import express, { Request, Response, NextFunction } from 'express';
import db from '../index';
import { ChurchInstance } from 'shared/SequelizeTypings/models';

const router = express.Router();

module.exports = router;

router.get('/getAll', async (req: Request, res: Response, next: NextFunction) => {
    db.Church.findAll({
        attributes: ['name', 'address', 'description'],
    })
        .then((churches: ChurchInstance[]) => res.status(200).json(churches))
        .catch((err) => {
            res.status(500);
            next(err);
        });
});

router.post('/createChurch', async (req: Request, res: Response, next: NextFunction) => {
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
});
