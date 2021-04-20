const TemplateFactory = (sequelize, DataTypes) => {
  const attributes = {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
    data: { type: DataTypes.JSON },
  };

  const Template = sequelize.define('Template', attributes);

  Template.associate = (models) => {
    Template.belongsTo(models.Church, { as: 'church', foreignKey: 'churchId' });
  };
  return Template;
};

export default TemplateFactory;
