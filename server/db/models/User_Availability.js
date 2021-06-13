const UserAvailabilityFactory = (sequelize, DataTypes) => {
  const attributes = {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    // warning: { type: DataTypes.BOOLEAN }, <-- setting to be made in church's settings
    unavailabilities: { type: DataTypes.ARRAY(DataTypes.DATEONLY) },
  };

  const UserAvailability = sequelize.define('UserAvailability', attributes);

  UserAvailability.associate = (models) => {
    UserAvailability.belongsTo(models.Availability, {
      as: 'availability',
      foreignKey: 'availabilityId',
    });
    UserAvailability.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
  };

  return UserAvailability;
};

export default UserAvailabilityFactory;
