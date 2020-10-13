import * as Sequelize from 'sequelize';

type ViewType = 'weekly' | 'monthly'; //

export interface ScheduleAttributes {
    id?: number;
    title: string;
    view: ViewType;
    timespan: string;
}

export interface ScheduleInstance extends Sequelize.Instance<ScheduleAttributes>, ScheduleAttributes {}
