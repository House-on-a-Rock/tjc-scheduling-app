const NotificationFactory = (sequelize, DataTypes) => {
  const attributes = {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER },
    message: { type: DataTypes.STRING },
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
  };

  const Notification = sequelize.define('Notification', attributes);

  Notification.associate = (models) => {
    Notification.belongsTo(models.Request, {
      as: 'request',
      foreignKey: 'requestId',
    });
    Notification.belongsTo(models.Task, {
      as: 'task',
      foreignKey: 'taskId',
    });
  };
  return Notification;
};

export default NotificationFactory;
