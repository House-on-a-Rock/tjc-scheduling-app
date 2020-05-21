import * as Sequelize from 'sequelize';
import { SequelizeAttributes } from 'shared/SequelizeTypings/typings/SequelizeAttributes';
import { TeamInstance, TeamAttributes } from 'shared/SequelizeTypings/models/TeamModel';

const TeamFactory = (
    sequelize: Sequelize.Sequelize,
    DataTypes: Sequelize.DataTypes,
): Sequelize.Model<TeamInstance, TeamAttributes> => {
    const attributes: SequelizeAttributes<TeamAttributes> = {
        name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    };

    const Team = sequelize.define<TeamInstance, TeamAttributes>('Team', attributes);

    Team.associate = (models) => {
        Team.belongsTo(models.Church, { as: 'church', foreignKey: 'ChurchId' });
        // Team.belongsTo(models.UserRole, { foreignKey: 'TeamId' });
    };

    return Team;
};

export default TeamFactory;
