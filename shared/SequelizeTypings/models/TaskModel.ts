import * as Sequelize from 'sequelize';

export interface TaskAttributes {
    id?: number;
    churchId?: number;
    userRoleId?: number;
    date: Date;
    status?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface TaskInstance extends Sequelize.Instance<TaskAttributes>, TaskAttributes {}
