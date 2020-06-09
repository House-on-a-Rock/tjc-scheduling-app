import * as Sequelize from 'sequelize';
import { SequelizeAttributes } from 'shared/SequelizeTypings/typings/SequelizeAttributes';
import {
    PassRecovTokenInstance,
    PassRecovTokenAttributes,
} from 'shared/SequelizeTypings/models';
import helper from '../../helper_functions';

const RecovTokenFactory = (
    sequelize: Sequelize.Sequelize,
    DataTypes: Sequelize.DataTypes,
): Sequelize.Model<PassRecovTokenInstance, PassRecovTokenAttributes> => {
    const attributes: SequelizeAttributes<PassRecovTokenAttributes> = {
        userId: { type: DataTypes.INTEGER },
        token: { type: DataTypes.STRING },
        expiresIn: {
            type: DataTypes.DATE,
            defaultValue: helper.addMinutes(new Date(), 30),
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: Date.now(),
        },
    };

    const RecovToken = sequelize.define<PassRecovTokenInstance, PassRecovTokenAttributes>(
        'RecovToken',
        attributes,
    );

    return RecovToken;
};

export default RecovTokenFactory;
