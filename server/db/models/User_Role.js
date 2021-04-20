const UserRoleFactory = (sequelize, DataTypes) => {
  const attributes = {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    teamLead: { type: DataTypes.BOOLEAN },
  };

  const UserRole = sequelize.define('UserRole', attributes);

  UserRole.associate = (models) => {
    UserRole.belongsTo(models.Role, { as: 'role', foreignKey: 'roleId' });
    UserRole.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
  };

  return UserRole;
};

export default UserRoleFactory;
