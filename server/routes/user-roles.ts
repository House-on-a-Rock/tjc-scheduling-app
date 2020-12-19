import express, { Request, Response, NextFunction } from 'express';
import { certify } from '../utilities/helperFunctions';
import db from '../index';

const router = express.Router();

module.exports = router;

router.get(
  '/user-roles/:userId',
  certify,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRoles = await db.UserRole.findAll({
        where: { userId: req.params.userId.toString() },
        attributes: ['roleId'],
        include: [
          {
            model: db.Role,
            as: 'role',
            attributes: ['name'],
          },
        ],
      });
      return userRoles
        ? res.status(200).json(userRoles)
        : res.status(404).send({ message: 'Not found' });
    } catch (err) {
      next(err);
      return res.status(503).send({ message: 'Server error, try again later' });
    }
  },
);
