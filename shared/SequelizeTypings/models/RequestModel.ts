import * as Sequelize from 'sequelize';
import { TaskAttributes } from './TaskModel';

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
    createdAt?: Date;
    updatedAt?: Date;
}

export interface RequestInstance
    extends Sequelize.Instance<RequestAttributes>,
        RequestAttributes {}
