import db from '../index';

export const findAllTemplates = async (churchId) =>
  db.Template.findAll({
    where: { churchId },
    attributes: [['id', 'templateId'], 'name', 'data'],
  });

export const findOneTemplate = async ({ churchId, name }) =>
  db.Template.findOne({
    where: { churchId, name },
  });

export const createTemplate = async (template) => db.Template.create(template);

export const destroyTemplate = async (templateId) =>
  db.Template.destroy({ where: { id: templateId } });
