const RequestFactory = (sequelize, DataTypes) => {
  const attributes = {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    requesteeUserId: { type: DataTypes.INTEGER },
    type: { type: DataTypes.STRING },
    accepted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    message: { type: DataTypes.STRING },
    replace: { type: DataTypes.BOOLEAN },
  };

  const Request = sequelize.define('Request', attributes);

  Request.associate = (models) => {
    Request.belongsTo(models.Task, { as: 'task', foreignKey: 'taskId' });
    Request.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
  };
  return Request;
};

export default RequestFactory;
