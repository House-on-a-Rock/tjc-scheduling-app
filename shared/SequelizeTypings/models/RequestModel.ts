import * as Sequelize from 'sequelize';
import { TaskAttributes } from './TaskModel';
import { UserAttributes } from './UserModel';

export interface RequestAttributes {
    id?: number;
    requesteeUserId: number;
    type: string;
    taskId?: number;
    accepted?: boolean;
    approved?: boolean;
    rejected?: boolean;
    task?: TaskAttributes;
    message?: string;
    replace?: boolean;
    userId?: number;
    user?: UserAttributes;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface RequestInstance
    extends Sequelize.Instance<RequestAttributes>,
        RequestAttributes {}
