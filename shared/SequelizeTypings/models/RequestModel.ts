import * as Sequelize from 'sequelize';
import { TaskAttributes } from './TaskModel';
import { UserAttributes } from './UserModel';
import { CommonSequelizeAttributes } from './index';

export interface RequestAttributes extends CommonSequelizeAttributes {
    requesteeUserId: number;
    type: string;
    taskId?: number;
    accepted?: boolean;
    approved?: boolean;
    task?: TaskAttributes;
    message?: string;
    replace?: boolean;
    userId?: number;
    user?: UserAttributes;
}

export interface RequestInstance extends Sequelize.Instance<RequestAttributes>, RequestAttributes {}
