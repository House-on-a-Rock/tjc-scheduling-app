import express, { Request, Response } from 'express';
import db from '../index';
import { UserInstance } from 'shared/SequelizeTypings/models';

const router = express.Router();

module.exports = router;

router.get('/getAllUsers', async (req: Request, res: Response, next) => {
    try {
        const users: UserInstance[] = await db.User.findAll({
            attributes: ['firstName', 'lastName', 'email', 'churchId'],
        });
        res.status(200).json(users);
    } catch (err) {
        next(err);
    }
});

// router.get('/getUser', async (req, res, next) => {
//     try {
//         const user = await db.User.findOne({
//             where: {
//                 id: req.query.id,
//             },
//             attributes: ['firstName', 'lastName', 'email'],
//         });
//         res.json(user);
//     } catch (err) {
//         next(err);
//     }
// });
