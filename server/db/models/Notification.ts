import * as Sequelize from 'sequelize';
import { SequelizeAttributes } from 'shared/SequelizeTypings/typings/SequelizeAttributes';
import { NotificationInstance, NotificationAttributes } from 'shared/SequelizeTypings/models';

const NotificationFactory = (
    sequelize: Sequelize.Sequelize,
    DataTypes: Sequelize.DataTypes,
): Sequelize.Model<NotificationInstance, NotificationAttributes> => {
    const attributes: SequelizeAttributes<NotificationAttributes> = {
        userId: { type: DataTypes.INTEGER },
        message: { type: DataTypes.STRING },
        isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
    };

    const Notification = sequelize.define<NotificationInstance, NotificationAttributes>('Notification', attributes);

    Notification.associate = (models) => {
        Notification.belongsTo(models.Request, {
            as: 'request',
            foreignKey: 'requestId',
        });
        Notification.belongsTo(models.Task, {
            as: 'task',
            foreignKey: 'taskId',
        });
    };
    return Notification;
};

export default NotificationFactory;
