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
        timeZone: { type: DataTypes.STRING },
    };

    const Church = sequelize.define<ChurchInstance, ChurchAttributes>(
        'Church',
        attributes,
    );

    Church.associate = (models) => {
        Church.hasMany(models.User, { foreignKey: 'churchId', as: 'church' });
        Church.hasMany(models.Role, { foreignKey: 'churchId' });
        Church.hasMany(models.Task, { foreignKey: 'churchId' });
    };

    return Church;
};

export default ChurchFactory;
