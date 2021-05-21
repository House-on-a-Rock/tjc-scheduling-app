import express from 'express';
// import Sequelize from 'sequelize';

import db from '../index';
import { retrieveAllTemplates } from '../services/templates';
import { certify } from '../utilities/helperFunctions';

const router = express.Router();

router.get('/templates', certify, async (req, res, next) => {
  try {
    const { churchId } = req.query;
    const templates = await retrieveAllTemplates(churchId);

    return res.status(200).json(templates);
  } catch (err) {
    next(err);
    return res.status(503).send({ message: 'Server error, try again later' });
  }
});

router.post('/templates', certify, async (req, res, next) => {
  try {
    const { churchId, name } = req.body;
    const isTemplateExist = await db.Template.findOne({
      where: { churchId: churchId, name: name },
    });
    if (isTemplateExist) {
      return next({
        status: 409,
        message: `A template named "${name}" already exists`,
      });
    }
    await db.Template.create(req.body);
    const templates = await retrieveAllTemplates(churchId);
    return res
      .status(200)
      .json({ message: 'Template created successfully', data: templates });
  } catch (err) {
    next(err);
    return res.status(503).send({ message: 'Server error, try again later' });
  }
});

export default router;
