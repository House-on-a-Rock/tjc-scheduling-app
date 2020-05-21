import * as Sequelize from 'sequelize';
import { SequelizeAttributes } from 'shared/SequelizeTypings/typings/SequelizeAttributes';
import {
    UserRoleInstance,
    UserRoleAttributes,
} from 'shared/SequelizeTypings/models/UserRoleModel';

const UserRoleFactory = (
    sequelize: Sequelize.Sequelize,
    DataTypes: Sequelize.DataTypes,
): Sequelize.Model<UserRoleInstance, UserRoleAttributes> => {
    const attributes: SequelizeAttributes<UserRoleAttributes> = {
        team_lead: {
            type: DataTypes.BOOLEAN,
        },
    };

    const UserRole = sequelize.define<UserRoleInstance, UserRoleAttributes>(
        'UserRole',
        attributes,
    );

    UserRole.associate = (models) => {
        UserRole.belongsTo(models.Team, { as: 'church', foreignKey: 'TeamId' });
    };

    return UserRole;
};

export default UserRoleFactory;
