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

router.get('/churches', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authorization } = req.headers;
        jwt.verify(authorization, cert);
        const church = await db.Church.findAll({
            attributes: ['name', 'address', 'description'],
        });

        const [message, status] = church
            ? ['Here is your church', 200]
            : ['Not Found', 404];

        return res.send(message).status(status);
    } catch (err) {
        next(err);
        const [message, status] =
            err instanceof TokenExpiredError || err instanceof JsonWebTokenError
                ? ['Unauthorized', 401]
                : ['Server error, try again later', 503];
        return res.send(message).status(status);
    }
});

router.post('/churches', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authorization } = req.headers;
        jwt.verify(authorization, cert);
        const church: ChurchInstance = await db.Church.create({
            name: req.body.name,
            address: req.body.address,
            description: req.body.description,
            timezone: req.body.timeZone,
        });
        res.status(201).send(church);
    } catch (err) {
        next(err);
        const [message, status] =
            err instanceof TokenExpiredError || err instanceof JsonWebTokenError
                ? ['Unauthorized', 401]
                : ['Server error, try again later', 503];
        return res.send(message).status(status);
    }
});

// router.delete('/churches', async (req: Request, res: Response, next: NextFunction) => {
//     try {

//     }catch (err) {
//         next(err);
//     }
// })
