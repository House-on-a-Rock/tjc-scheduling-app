import * as Sequelize from 'sequelize';
import { SequelizeAttributes } from 'shared/SequelizeTypings/typings/SequelizeAttributes';
import { TaskInstance, TaskAttributes } from 'shared/SequelizeTypings/models';

const TaskFactory = (
    sequelize: Sequelize.Sequelize,
    DataTypes: Sequelize.DataTypes,
): Sequelize.Model<TaskInstance, TaskAttributes> => {
    const attributes: SequelizeAttributes<TaskAttributes> = {
        date: { type: DataTypes.DATE },
        status: { type: DataTypes.STRING, defaultValue: 'active' },
    };

    const Task = sequelize.define<TaskInstance, TaskAttributes>('Task', attributes);

    Task.associate = (models) => {
        Task.belongsTo(models.Church, { as: 'church', foreignKey: 'churchId' });
        Task.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
        Task.belongsTo(models.Role, { as: 'role', foreignKey: 'roleId' });
    };
    return Task;
};

export default TaskFactory;
