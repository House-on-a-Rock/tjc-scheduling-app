import * as Sequelize from 'sequelize';
import { SequelizeAttributes } from 'shared/SequelizeTypings/typings/SequelizeAttributes';
import { TemplateInstance, TemplateAttributes } from 'shared/SequelizeTypings/models';

const TemplateFactory = (
  sequelize: Sequelize.Sequelize,
  DataTypes: Sequelize.DataTypes,
): Sequelize.Model<TemplateInstance, TemplateAttributes> => {
  const attributes: SequelizeAttributes<TemplateAttributes> = {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
    data: { type: DataTypes.JSON },
  };

  const Template = sequelize.define<TemplateInstance, TemplateAttributes>(
    'Template',
    attributes,
  );

  Template.associate = (models) => {
    Template.belongsTo(models.Church, { as: 'church', foreignKey: 'churchId' });
  };
  return Template;
};

export default TemplateFactory;
