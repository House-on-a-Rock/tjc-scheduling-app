const TaskFactory = (sequelize, DataTypes) => {
  const attributes = {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    date: { type: DataTypes.DATE },
    status: { type: DataTypes.STRING, defaultValue: 'active' },
  };

  const Task = sequelize.define('Task', attributes);

  Task.associate = (models) => {
    Task.belongsTo(models.Event, { as: 'event', foreignKey: 'eventId' });
    Task.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
  };
  return Task;
};

export default TaskFactory;
