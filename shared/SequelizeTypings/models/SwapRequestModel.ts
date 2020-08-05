import * as Sequelize from 'sequelize';
import { TaskAttributes } from './TaskModel';

export interface SwapRequestAttributes {
    id?: number;
    requesteeUserId: number;
    type: string;
    TaskId?: number;
    accepted?: boolean;
    approved?: boolean;
    rejected?: boolean;
    task?: TaskAttributes;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface SwapRequestInstance
    extends Sequelize.Instance<SwapRequestAttributes>,
        SwapRequestAttributes {}
