import * as Sequelize from 'sequelize';
import { CommonSequelizeAttributes } from '.';
import { UserRoleAttributes } from './UserRoleModel';

type StatusTypes = 'active' | 'changeRequested';

export interface TaskAttributes extends CommonSequelizeAttributes {
    status?: StatusTypes;
    date: Date;
    userRoleId?: number;
    eventId?: number;
    userRole?: UserRoleAttributes;
}

export interface TaskInstance extends Sequelize.Instance<TaskAttributes>, TaskAttributes {}
