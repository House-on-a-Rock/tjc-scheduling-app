import { findAllTemplates } from '../dataAccess/templates';
import db from '../index';

export const retrieveAllTemplates = async (churchId) => {
  const templates = await findAllTemplates(churchId);

  // inject role names
  const completeTemplates = await Promise.all(
    templates.map(async (template) => {
      const { templateId, name, data } = template.dataValues;

      const services = await Promise.all(
        data.map(async (service) => {
          const events = await Promise.all(
            service.events.map(async (event) => {
              const role = await db.Role.findOne({ where: { id: event.roleId } });
              return { ...event, title: role ? role.name : 'Error: role not found' };
            }),
          );
          return { ...service, events };
        }),
      );
      return { templateId, name, data: services };
    }),
  );

  return completeTemplates;
};

// temp so that prettier doesn't yell at me
export const a = null;
