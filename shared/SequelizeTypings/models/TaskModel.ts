import * as Sequelize from 'sequelize';

export interface TaskAttributes {
    id?: number;
    churchId?: number;
    userId?: number;
    roleId?: number;
    date: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface TaskInstance
    extends Sequelize.Instance<TaskAttributes>,
        TaskAttributes {}
