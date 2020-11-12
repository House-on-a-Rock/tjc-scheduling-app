import * as Sequelize from 'sequelize';
import { CommonSequelizeAttributes } from '.';

type ViewType = 'weekly' | 'monthly'; //

export interface ScheduleAttributes extends CommonSequelizeAttributes {
    title: string;
    view: ViewType;
    start: Date;
    end: Date;
    churchId?: number;
    team: number;
}

export interface ScheduleInstance extends Sequelize.Instance<ScheduleAttributes>, ScheduleAttributes {}
