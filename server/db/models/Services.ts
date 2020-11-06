import * as Sequelize from 'sequelize';
import { SequelizeAttributes } from 'shared/SequelizeTypings/typings/SequelizeAttributes';
import { ServiceInstance, ServiceAttributes } from 'shared/SequelizeTypings/models/ServiceModel';

const ServiceFactory = (
    sequelize: Sequelize.Sequelize,
    DataTypes: Sequelize.DataTypes,
): Sequelize.Model<ServiceInstance, ServiceAttributes> => {
    const attributes: SequelizeAttributes<ServiceAttributes> = {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        order: { type: DataTypes.INTEGER },
        start: { type: DataTypes.STRING },
        end: { type: DataTypes.STRING },
        day: { type: DataTypes.STRING },
    };

    const Service = sequelize.define<ServiceInstance, ServiceAttributes>('Service', attributes);

    Service.associate = (models) => {
        Service.belongsTo(models.Schedule, { as: 'schedule', foreignKey: 'scheduleId' });
    };

    return Service;
};

export default ServiceFactory;
