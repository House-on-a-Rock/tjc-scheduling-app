import express, { Request, Response, NextFunction } from 'express';
import db from '../index';
import { certify } from '../utilities/helperFunctions';

const router = express.Router();
module.exports = router;

router.delete(
  '/event',
  certify,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { eventId } = req.body;
      console.log(req.body);
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
