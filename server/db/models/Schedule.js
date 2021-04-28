const ScheduleFactory = (sequelize, DataTypes) => {
  const attributes = {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING },
    view: { type: DataTypes.STRING },
    start: { type: DataTypes.DATE },
    end: { type: DataTypes.DATE },
    roleId: { type: DataTypes.INTEGER },
    churchId: { type: DataTypes.INTEGER },
  };

  const Schedule = sequelize.define('Schedule', attributes);

  Schedule.associate = (models) => {
    Schedule.belongsTo(models.Church, { as: 'church', foreignKey: 'churchId' });
    Schedule.hasOne(models.Role, { as: 'role', foreignKey: 'roleId' });
    Schedule.hasMany(models.Service, {
      as: 'schedule',
      foreignKey: 'scheduleId',
      onDelete: 'cascade',
      hooks: true,
    });
    // Schedule.hasMany(models.Events)
  };

  return Schedule;
};

export default ScheduleFactory;
