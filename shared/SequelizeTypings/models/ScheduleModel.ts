import * as Sequelize from 'sequelize';
import { CommonSequelizeAttributes } from '.';

type ViewType = 'weekly' | 'monthly'; //

export interface ScheduleAttributes extends CommonSequelizeAttributes {
    title: string;
    view: ViewType;
    start: Date;
    end: Date;
    // timespan: string;
}

export interface ScheduleInstance extends Sequelize.Instance<ScheduleAttributes>, ScheduleAttributes {}
