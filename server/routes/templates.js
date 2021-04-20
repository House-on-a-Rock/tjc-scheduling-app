import express from 'express';
import Sequelize from 'sequelize';
import db from '../index';
import { certify } from '../utilities/helperFunctions';

const router = express.Router();
const { Op } = Sequelize;

router.get('/templates', certify, async (req, res, next) => {
  try {
    const { churchId } = req.query;
    const templates = await db.Template.findAll({
      where: { churchId: churchId.toString() },
      attributes: [['id', 'templateId'], 'name', 'data'],
    });
    return res.status(200).json(templates);
  } catch (err) {
    next(err);
    return res.status(503).send({ message: 'Server error, try again later' });
  }
});

export default router;
