import * as Sequelize from 'sequelize';
import { SequelizeAttributes } from 'shared/SequelizeTypings/typings/SequelizeAttributes';
import { DividerInstance, DividerAttributes } from 'shared/SequelizeTypings/models/DividerModel';

const DividerFactory = (
    sequelize: Sequelize.Sequelize,
    DataTypes: Sequelize.DataTypes,
): Sequelize.Model<DividerInstance, DividerAttributes> => {
    const attributes: SequelizeAttributes<DividerAttributes> = {
        name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        order: { type: DataTypes.INTEGER },
        start: { type: DataTypes.STRING },
        end: { type: DataTypes.STRING },
    };

    const Divider = sequelize.define<DividerInstance, DividerAttributes>('Divider', attributes);

    Divider.associate = (models) => {
        Divider.belongsTo(models.Schedule, { as: 'schedule', foreignKey: 'scheduleId' });
    };

    return Divider;
};

export default DividerFactory;
