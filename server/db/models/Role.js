const RoleFactory = (sequelize, DataTypes) => {
  const attributes = {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
  };

  const Role = sequelize.define('Role', attributes);

  Role.associate = (models) => {
    Role.belongsTo(models.Church, { as: 'church', foreignKey: 'churchId' });
  };

  return Role;
};

export default RoleFactory;
