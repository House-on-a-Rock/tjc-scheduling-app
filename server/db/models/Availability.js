const AvailabilityFactory = (sequelize, DataTypes) => {
  const attributes = {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    deadline: { type: DataTypes.DATEONLY },
    start: { type: DataTypes.DATEONLY },
    end: { type: DataTypes.DATEONLY },
  };

  const Availability = sequelize.define('Availability', attributes);

  Availability.associate = (models) => {
    Availability.belongsTo(models.Church, { as: 'church', foreignKey: 'churchId' });
  };

  return Availability;
};

export default AvailabilityFactory;

// Availabilites is a data structure that knows churchid, (church has one avaiability), contains deadline, start date and end date.
// User is connected to Availabilities via User_Availabilities
// When an
