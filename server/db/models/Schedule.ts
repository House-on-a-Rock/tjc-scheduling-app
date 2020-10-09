import * as Sequelize from 'sequelize';
import { SequelizeAttributes } from 'shared/SequelizeTypings/typings/SequelizeAttributes';
import { ScheduleInstance, ScheduleAttributes } from 'shared/SequelizeTypings/models/ScheduleModel';

const ScheduleFactory = (
    sequelize: Sequelize.Sequelize,
    DataTypes: Sequelize.DataTypes,
): Sequelize.Model<ScheduleInstance, ScheduleAttributes> => {
    const attributes: SequelizeAttributes<ScheduleAttributes> = {
        title: { type: DataTypes.STRING },
        view: { type: DataTypes.STRING },
        start: { type: DataTypes.DATE },
        end: { type: DataTypes.DATE },
    };

    const Schedule = sequelize.define<ScheduleInstance, ScheduleAttributes>('Schedule', attributes);

    Schedule.associate = (models) => {
        Schedule.belongsTo(models.Church, { as: 'church', foreignKey: 'churchId' });
    };

    return Schedule;
};

export default ScheduleFactory;
