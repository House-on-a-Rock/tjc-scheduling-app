import * as Sequelize from 'sequelize';
import { SequelizeAttributes } from 'shared/SequelizeTypings/typings/SequelizeAttributes';
import { EventTaskInstance, EventTaskAttributes } from 'shared/SequelizeTypings/models/EventTaskModel';

const EventTaskFactory = (
    sequelize: Sequelize.Sequelize,
    DataTypes: Sequelize.DataTypes,
): Sequelize.Model<EventTaskInstance, EventTaskAttributes> => {
    const attributes: SequelizeAttributes<EventTaskAttributes> = {};

    const EventTask = sequelize.define<EventTaskInstance, EventTaskAttributes>('EventTask', attributes);

    EventTask.associate = (models) => {
        EventTask.belongsTo(models.Event, { as: 'event', foreignKey: 'eventId' });
        EventTask.belongsTo(models.Task, { as: 'task', foreignKey: 'taskId' });
    };

    return EventTask;
};

export default EventTaskFactory;
