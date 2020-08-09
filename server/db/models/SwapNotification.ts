import * as Sequelize from 'sequelize';
import { SequelizeAttributes } from 'shared/SequelizeTypings/typings/SequelizeAttributes';
import {
    SwapNotificationInstance,
    SwapNotificationAttributes,
} from 'shared/SequelizeTypings/models';

const SwapNotificationFactory = (
    sequelize: Sequelize.Sequelize,
    DataTypes: Sequelize.DataTypes,
): Sequelize.Model<SwapNotificationInstance, SwapNotificationAttributes> => {
    const attributes: SequelizeAttributes<SwapNotificationAttributes> = {
        userId: { type: DataTypes.INTEGER },
        message: { type: DataTypes.STRING },
    };

    const SwapNotification = sequelize.define<
        SwapNotificationInstance,
        SwapNotificationAttributes
    >('SwapNotification', attributes);

    SwapNotification.associate = (models) => {
        SwapNotification.belongsTo(models.SwapRequest, {
            as: 'request',
            foreignKey: 'RequestId',
        });
    };
    return SwapNotification;
};

export default SwapNotificationFactory;
