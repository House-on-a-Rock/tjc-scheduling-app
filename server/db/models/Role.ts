import * as Sequelize from 'sequelize';
import { SequelizeAttributes } from 'shared/SequelizeTypings/typings/SequelizeAttributes';
import { RoleInstance, RoleAttributes } from 'shared/SequelizeTypings/models';

const RoleFactory = (
  sequelize: Sequelize.Sequelize,
  DataTypes: Sequelize.DataTypes,
): Sequelize.Model<RoleInstance, RoleAttributes> => {
  const attributes: SequelizeAttributes<RoleAttributes> = {
    name: { type: DataTypes.STRING },
  };

  const Role = sequelize.define<RoleInstance, RoleAttributes>('Role', attributes);

  Role.associate = (models) => {
    Role.belongsTo(models.Church, { as: 'church', foreignKey: 'churchId' });
  };

  return Role;
};

export default RoleFactory;
