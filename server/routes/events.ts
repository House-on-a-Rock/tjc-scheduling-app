import express, { Request, Response, NextFunction } from 'express';
import { ScheduleInstance } from 'shared/SequelizeTypings/models';
import db from '../index';
import {
  certify,
  createColumns,
  populateServiceData,
} from '../utilities/helperFunctions';

const router = express.Router();
module.exports = router;

router.delete(
  '/events',
  certify,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { eventId } = req.body;
      await db.Event.destroy({
        where: {
          id: eventId,
        },
      });
      return res.status(200).send(`Event successfully deleted`);
    } catch (err) {
      next(err);
      return res.status(503).send({ message: 'Server error, try again later' });
    }
  },
);
