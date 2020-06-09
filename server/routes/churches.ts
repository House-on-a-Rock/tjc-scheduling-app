import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import { ChurchInstance } from 'shared/SequelizeTypings/models';
import db from '../index';

const router = express.Router();
let cert;
fs.readFile('tjcschedule_pub.pem', function read(err, data) {
    if (err) throw err;
    cert = data;
    console.log(cert);
});
module.exports = router;

router.get('/getAll', (req: Request, res: Response, next: NextFunction) => {
    try {
        const verify = jwt.verify(req.headers.authorization, cert);
        db.Church.findAll({
            attributes: ['name', 'address', 'description'],
        })
            .then((churches: ChurchInstance[]) => res.status(200).json(churches))
            .catch((err) => {
                res.status(500);
                next(err);
            });
    } catch (err) {
        next(err);
    }
});

router.post('/createChurch', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const verify = jwt.verify(req.headers.authorization, cert);
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
