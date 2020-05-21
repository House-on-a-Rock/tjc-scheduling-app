import express, { Request, Response, NextFunction } from 'express';
import db from '../index';

const router = express.Router();
module.exports = router;

router.get('/getAll', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const church = await db.Church.findAll({
            attributes: ['name', 'address', 'description'],
        });
        res.status(200).json(church);
    } catch (err) {
        next(err);
    }
});

router.post('/createChurch', async (req: Request, res: Response, next: NextFunction) => {
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
});
