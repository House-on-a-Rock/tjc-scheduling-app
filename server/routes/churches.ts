import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import jwt, { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { ChurchInstance } from 'shared/SequelizeTypings/models';
import db from '../index';

const router = express.Router();
let cert;
fs.readFile('tjcschedule_pub.pem', function read(err, data) {
    if (err) throw err;
    cert = data;
});
module.exports = router;

router.get('/churches', (req: Request, res: Response, next: NextFunction) => {
    try {
        jwt.verify(req.headers.authorization, cert);
        db.Church.findAll({
            attributes: ['name', 'address', 'description'],
        })
            .then((churches: ChurchInstance[]) => {
                if (churches) res.status(200).json(churches);
                else res.status(404).send({ message: 'Not found' });
            })
            .catch((err) => {
                res.status(500);
                next(err);
            });
    } catch (err) {
        if (err instanceof TokenExpiredError || err instanceof JsonWebTokenError) {
            res.status(401).send({ message: 'Unauthorized' });
        } else {
            res.status(503).send({ message: 'Server error, try again later' });
        }
        next(err);
    }
});

router.post('/churches', async (req: Request, res: Response, next: NextFunction) => {
    try {
        jwt.verify(req.headers.authorization, cert);
        const church: ChurchInstance = await db.Church.create({
            name: req.body.name,
            address: req.body.address,
            description: req.body.description,
            timeZone: req.body.timeZone,
        });
        res.status(201).send(church);
    } catch (err) {
        if (err instanceof TokenExpiredError || err instanceof JsonWebTokenError) {
            res.status(401).send({ message: 'Unauthorized' });
        } else {
            res.status(503).send({ message: 'Server error, try again later' });
        }
        next(err);
    }
});

// router.delete('/churches', async (req: Request, res: Response, next: NextFunction) => {
//     try {

//     }catch (err) {
//         next(err);
//     }
// })
