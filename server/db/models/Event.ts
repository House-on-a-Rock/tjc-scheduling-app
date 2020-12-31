import * as Sequelize from 'sequelize';
import { SequelizeAttributes } from 'shared/SequelizeTypings/typings/SequelizeAttributes';
import {
  EventInstance,
  EventAttributes,
} from 'shared/SequelizeTypings/models/EventModel';

const EventFactory = (
  sequelize: Sequelize.Sequelize,
  DataTypes: Sequelize.DataTypes,
): Sequelize.Model<EventInstance, EventAttributes> => {
  const attributes: SequelizeAttributes<EventAttributes> = {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    serviceId: { type: DataTypes.INTEGER },
    // day: { type: DataTypes.STRING },
    order: { type: DataTypes.INTEGER },
    time: { type: DataTypes.STRING },
    title: { type: DataTypes.STRING },
    roleId: { type: DataTypes.INTEGER },
    displayTime: { type: DataTypes.BOOLEAN },
  };

  const Event = sequelize.define<EventInstance, EventAttributes>('Event', attributes);

  Event.associate = (models) => {
    Event.belongsTo(models.Service, {
      foreignKey: 'serviceId',
      onDelete: 'cascade',
      hooks: true,
    });
    Event.belongsTo(models.Role, { foreignKey: 'roleId' });
    Event.hasMany(models.Task, {
      foreignKey: 'eventId',
      onDelete: 'cascade',
      hooks: true,
    });
  };

  return Event;
};

export default EventFactory;
