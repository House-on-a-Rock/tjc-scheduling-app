import * as Sequelize from 'sequelize';
import { SequelizeAttributes } from 'shared/SequelizeTypings/typings/SequelizeAttributes';
import { RequestInstance, RequestAttributes } from 'shared/SequelizeTypings/models';

const RequestFactory = (
    sequelize: Sequelize.Sequelize,
    DataTypes: Sequelize.DataTypes,
): Sequelize.Model<RequestInstance, RequestAttributes> => {
    const attributes: SequelizeAttributes<RequestAttributes> = {
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
        rejected: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        message: { type: DataTypes.STRING },
    };

    const Request = sequelize.define<RequestInstance, RequestAttributes>(
        'Request',
        attributes,
    );

    Request.associate = (models) => {
        Request.belongsTo(models.Task, { as: 'task', foreignKey: 'taskId' });
    };
    return Request;
};

export default RequestFactory;
