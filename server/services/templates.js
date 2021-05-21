import db from '../index';

export const retrieveAllTemplates = async (churchId) => {
  const templates = await db.Template.findAll({
    where: { churchId: churchId.toString() },
    attributes: [['id', 'templateId'], 'name', 'data'],
  });

  // inject userRole names into return obj
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

export const a = null;
