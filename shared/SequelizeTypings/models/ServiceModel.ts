import * as Sequelize from 'sequelize';
import { CommonSequelizeAttributes } from '.';

export interface ServiceAttributes extends CommonSequelizeAttributes {
    name?: string;
    start: string;
    end: string;
    order: number;
    scheduleId?: number;
    day: string;
}

export interface ServiceInstance extends Sequelize.Instance<ServiceAttributes>, ServiceAttributes {}
