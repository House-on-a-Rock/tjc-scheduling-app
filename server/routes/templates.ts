import express, { Request, Response, NextFunction } from 'express';
import Sequelize from 'sequelize';
import { UserInstance } from 'shared/SequelizeTypings/models';
import db from '../index';
import { certify, setDate } from '../utilities/helperFunctions';

const router = express.Router();
const { Op } = Sequelize;

module.exports = router;

router.get(
  '/templates',
  certify,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('req in templates', req);
      const { churchId } = req.query;
      return res.status(200).json('template');
    } catch (err) {
      next(err);
      return res.status(503).send({ message: 'Server error, try again later' });
    }
  },
);
