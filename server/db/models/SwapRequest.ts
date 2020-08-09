import * as Sequelize from 'sequelize';
import { SequelizeAttributes } from 'shared/SequelizeTypings/typings/SequelizeAttributes';
import {
    SwapRequestInstance,
    SwapRequestAttributes,
} from 'shared/SequelizeTypings/models';

const SwapRequestFactory = (
    sequelize: Sequelize.Sequelize,
    DataTypes: Sequelize.DataTypes,
): Sequelize.Model<SwapRequestInstance, SwapRequestAttributes> => {
    const attributes: SequelizeAttributes<SwapRequestAttributes> = {
        requesteeUserId: { type: DataTypes.INTEGER },
        type: { type: DataTypes.STRING },
        accepted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        approved: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        rejected: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    };

    const SwapRequest = sequelize.define<SwapRequestInstance, SwapRequestAttributes>(
        'SwapRequest',
        attributes,
    );

    SwapRequest.associate = (models) => {
        SwapRequest.belongsTo(models.Task, { as: 'task', foreignKey: 'TaskId' });
    };
    return SwapRequest;
};

export default SwapRequestFactory;
