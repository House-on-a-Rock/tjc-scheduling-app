import * as Sequelize from 'sequelize';
import { CommonSequelizeAttributes } from '.';

export interface DividerAttributes extends CommonSequelizeAttributes {
    name?: string;
    start: string;
    end: string;
    order: number;
    scheduleId?: number;
}

export interface DividerInstance extends Sequelize.Instance<DividerAttributes>, DividerAttributes {}
