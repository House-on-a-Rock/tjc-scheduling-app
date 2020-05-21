import * as Sequelize from 'sequelize';
import { SequelizeAttributes } from 'shared/SequelizeTypings/typings/SequelizeAttributes';
import {
    ChurchInstance,
    ChurchAttributes,
} from 'shared/SequelizeTypings/models/ChurchModel';

const ChurchFactory = (
    sequelize: Sequelize.Sequelize,
    DataTypes: Sequelize.DataTypes,
): Sequelize.Model<ChurchInstance, ChurchAttributes> => {
    const attributes: SequelizeAttributes<ChurchAttributes> = {
        name: { type: DataTypes.STRING },
        address: { type: DataTypes.TEXT },
        description: { type: DataTypes.TEXT },
    };

    const Church = sequelize.define<ChurchInstance, ChurchAttributes>(
        'Church',
        attributes,
    );

    Church.associate = (models) => {
        Church.hasMany(models.User, { foreignKey: 'ChurchId', as: 'church' });
        Church.hasMany(models.Role, { foreignKey: 'ChurchId' });
        Church.hasMany(models.Task, { foreignKey: 'ChurchId' });
    };

    return Church;
};

export default ChurchFactory;
