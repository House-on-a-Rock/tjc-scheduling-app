/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import express, { Request, Response, NextFunction } from 'express';
// import Sequelize from 'sequelize';
import db from '../index';
import { certify } from '../utilities/helperFunctions';

const router = express.Router();
// const { Op } = Sequelize;
const { green, red, blue } = require('chalk');

module.exports = router;

router.post(
  '/service',
  certify,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, order, dayOfWeek, scheduleId } = req.body;
      const dbService = await db.Service.findOne({
        where: {
          name,
          scheduleId,
        },
      });

      if (dbService) return res.status(409).send({ message: 'Service already exists' });

      const newService = await db.Service.create({
        name,
        order,
        day: dayOfWeek,
        scheduleId: scheduleId,
      });

      // return res.status(200).json(newService);
      return res.status(200).send(`Service ${newService.name} successfully added`);
    } catch (err) {
      next(err);
      return res.status(503).send({ message: 'Server error, try again later' });
    }
  },
);
