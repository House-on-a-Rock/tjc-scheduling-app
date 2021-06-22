import express from 'express';

import {
  createTemplate,
  destroyTemplate,
  findOneTemplate,
} from '../dataAccess/templates';
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
    const isTemplateExist = await findOneTemplate({ churchId, name });
    // these name checks are case-sensitive, should we make them case-insensitive?
    if (isTemplateExist) {
      return next({
        status: 409,
        message: `A template named "${name}" already exists`,
      });
    }
    await createTemplate(req.body);
    const templates = await retrieveAllTemplates(churchId);
    return res
      .status(200)
      .json({ message: 'Template created successfully', data: templates });
  } catch (err) {
    next(err);
    return next({ status: 503, message: 'Server error, please try again later' });
  }
});

router.delete('/templates', certify, async (req, res, next) => {
  try {
    const { templateId, churchId } = req.query;
    await destroyTemplate(templateId);
    const templates = await retrieveAllTemplates(churchId);

    return res
      .status(200)
      .json({ message: 'Template deleted successfully', data: templates });
  } catch (err) {
    next(err);
    return next({ status: 503, message: 'Server error, please try again later' });
  }
});

export default router;
