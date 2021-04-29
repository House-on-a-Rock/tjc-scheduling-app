const AvailabilitiesFactory = (sequelize, DataTypes) => {
  const attributes = {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER },
    churchId: { type: DataTypes.INTEGER },
    dateRange: { type: DataTypes.STRING },
    unavailablities: { type: DataTypes.TEXT },
  };

  const Availabilities = sequelize.define('Availabilities', attributes);

  Availabilities.associate = (models) => {
    Availabilities.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
    Availabilities.belongsTo(models.Church, { as: 'church', foreignKey: 'churchId' });
  };

  return Availabilities;
};

export default AvailabilitiesFactory;
