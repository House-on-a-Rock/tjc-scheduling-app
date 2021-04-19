const ChurchFactory = (sequelize, DataTypes) => {
  const attributes = {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
    address: { type: DataTypes.TEXT },
    description: { type: DataTypes.TEXT },
    timezone: { type: DataTypes.STRING },
  };

  const Church = sequelize.define('Church', attributes);

  Church.associate = (models) => {
    Church.hasMany(models.User, { foreignKey: 'churchId' });
    Church.hasMany(models.Role, { foreignKey: 'roleId' });
  };

  return Church;
};

export default ChurchFactory;
