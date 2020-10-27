import * as Sequelize from 'sequelize';
import { CommonSequelizeAttributes } from '.';

export interface EventAttributes extends CommonSequelizeAttributes {
    roleId?: number; // team
    day: string;
    order: number;
    time: string;
    title: string;
}

export interface EventInstance extends Sequelize.Instance<EventAttributes>, EventAttributes {}
