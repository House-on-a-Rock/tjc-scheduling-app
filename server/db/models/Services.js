const ServiceFactory = (sequelize, DataTypes) => {
  const attributes = {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    order: { type: DataTypes.INTEGER },
    day: { type: DataTypes.INTEGER },
    scheduleId: { type: DataTypes.INTEGER },
  };

  const Service = sequelize.define('Service', attributes);

  Service.associate = (models) => {
    Service.belongsTo(models.Schedule, {
      as: 'schedule',
      foreignKey: 'scheduleId',
    });
    Service.hasMany(models.Event, {
      as: 'service',
      foreignKey: 'serviceId',
      onDelete: 'cascade',
      hooks: true,
    });
  };

  return Service;
};

export default ServiceFactory;
