import * as Sequelize from 'sequelize';
import { SequelizeAttributes } from 'shared/SequelizeTypings/typings/SequelizeAttributes';
import {
  AvailabilityInstance,
  AvailabilityAttributes,
} from 'shared/SequelizeTypings/models/AvailabilityModel';

const AvailabilitiesFactory = (
  sequelize: Sequelize.Sequelize,
  DataTypes: Sequelize.DataTypes,
): Sequelize.Model<AvailabilityInstance, AvailabilityAttributes> => {
  const attributes: SequelizeAttributes<AvailabilityAttributes> = {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER },
    churchId: { type: DataTypes.INTEGER },
    dateRange: { type: DataTypes.STRING },
    unavailablities: { type: DataTypes.TEXT },
  };

  const Availabilities = sequelize.define<AvailabilityInstance, AvailabilityAttributes>(
    'Availabilities',
    attributes,
  );

  Availabilities.associate = (models) => {
    Availabilities.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
    Availabilities.belongsTo(models.Church, { as: 'church', foreignKey: 'churchId' });
  };

  return Availabilities;
};

export default AvailabilitiesFactory;
