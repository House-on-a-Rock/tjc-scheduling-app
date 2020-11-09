import * as Sequelize from 'sequelize';
import { SequelizeAttributes } from 'shared/SequelizeTypings/typings/SequelizeAttributes';
import { EventInstance, EventAttributes } from 'shared/SequelizeTypings/models/EventModel';

const EventFactory = (
    sequelize: Sequelize.Sequelize,
    DataTypes: Sequelize.DataTypes,
): Sequelize.Model<EventInstance, EventAttributes> => {
    const attributes: SequelizeAttributes<EventAttributes> = {
        serviceId: { type: DataTypes.INTEGER },
        day: { type: DataTypes.STRING },
        order: { type: DataTypes.INTEGER },
        time: { type: DataTypes.STRING },
        title: { type: DataTypes.STRING },
        roleId: { type: DataTypes.INTEGER },
    };

    const Event = sequelize.define<EventInstance, EventAttributes>('Event', attributes);

    Event.associate = (models) => {
        // Event.belongsTo(models.Schedule, { foreignKey: 'scheduleId' });
        Event.belongsTo(models.Service, { foreignKey: 'serviceId' });
        Event.belongsTo(models.Role, { foreignKey: 'roleId' });
    };

    return Event;
};

export default EventFactory;
