import * as Sequelize from 'sequelize';

type ViewType = 'weekly' | 'monthly'; //

export interface ScheduleAttributes {
    id?: number;
    view: ViewType;
    timespan: string;
}

export interface ScheduleInstance extends Sequelize.Instance<ScheduleAttributes>, ScheduleAttributes {}
