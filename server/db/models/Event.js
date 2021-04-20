const EventFactory = (sequelize, DataTypes) => {
  const attributes = {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    serviceId: { type: DataTypes.INTEGER },
    order: { type: DataTypes.INTEGER },
    time: { type: DataTypes.STRING },
    roleId: { type: DataTypes.INTEGER },
  };

  const Event = sequelize.define('Event', attributes);

  Event.associate = (models) => {
    Event.belongsTo(models.Service, {
      foreignKey: 'serviceId',
      onDelete: 'cascade',
      hooks: true,
    });
    Event.belongsTo(models.Role, { foreignKey: 'roleId' });
    Event.hasMany(models.Task, {
      foreignKey: 'eventId',
      onDelete: 'cascade',
      hooks: true,
    });
  };

  return Event;
};

export default EventFactory;
