import express, { Request, Response, NextFunction } from 'express';
import { ChurchInstance } from 'shared/SequelizeTypings/models';
import { certify } from '../utilities/helperFunctions';

import db from '../index';

const router = express.Router();

module.exports = router;

router.get('/churches', certify, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const church = await db.Church.findAll({
            attributes: ['name', 'address', 'description'],
        });

        const [message, status] = church ? ['Here is your church', 200] : ['Not Found', 404];

        return res.send({ message }).status(status);
    } catch (err) {
        next(err);
        return res.status(503).send({ message: 'Server error, try again later' });
    }
});

router.post('/churches', certify, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const church: ChurchInstance = await db.Church.create({
            name: req.body.name,
            address: req.body.address,
            description: req.body.description,
            timezone: req.body.timeZone,
        });
        return res.status(201).send(church);
    } catch (err) {
        next(err);
        return res.status(503).send({ message: 'Server error, try again later' });
    }
});

// router.delete('/churches', async (req: Request, res: Response, next: NextFunction) => {
//     try {

//     }catch (err) {
//         next(err);
//     }
// })
