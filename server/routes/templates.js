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
    // console.log(`templates`, templates);

    // inject userRole names into return obj
    const completeTemplates = await Promise.all(
      templates.map(async (template) => {
        const { templateId, name, data } = template.dataValues;

        const services = await Promise.all(
          data.map(async (service) => {
            const events = await Promise.all(
              service.events.map(async (event) => {
                const role = await db.Role.findOne({ where: { id: event.roleId } });
                return { ...event, title: role.name };
              }),
            );
            return { ...service, events };
          }),
        );

        return { templateId, name, data: services };
      }),
    );
    console.log(`completeTemplates`, completeTemplates);
    // console.log(`templates`, templates);

    return res.status(200).json(completeTemplates);
  } catch (err) {
    next(err);
    return res.status(503).send({ message: 'Server error, try again later' });
  }
});

router.post('/templates', certify, async (req, res, next) => {
  try {
    const n = { ...req.body, data: JSON.stringify(req.body.data) };
    console.log(`n`, n);
    const newTemplate = await db.Template.create();
    return res
      .status(200)
      .json({ message: 'Template created successfully', data: newTemplate });
  } catch (err) {
    next(err);
    return res.status(503).send({ message: 'Server error, try again later' });
  }
});

export default router;
