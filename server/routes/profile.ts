import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import db from '../index';

const router = express.Router();
const cert = fs.readFileSync('tjcschedule_pub.pem');
module.exports = router;

router.get('/getAll', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const verify = jwt.verify(req.headers.authorization, cert);
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
        const verify = jwt.verify(req.headers.authorization, cert);
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
