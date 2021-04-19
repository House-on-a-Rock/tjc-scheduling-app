import express, { Request, Response, NextFunction } from 'express';
import Sequelize from 'sequelize';
import { TemplateInstance } from 'shared/SequelizeTypings/models';
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
      const { churchId } = req.query;
      const templates: TemplateInstance[] = await db.Template.findAll({
        where: { churchId: churchId.toString() },
        attributes: [['id', 'templateId'], 'name', 'data'],
      });
      return res.status(200).json(templates);
    } catch (err) {
      next(err);
      return res.status(503).send({ message: 'Server error, try again later' });
    }
  },
);
