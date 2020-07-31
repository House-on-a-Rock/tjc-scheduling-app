import * as Sequelize from 'sequelize';

export interface TaskAttributes {
    id?: number;
    ChurchId?: number;
    UserId?: number;
    date: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface TaskInstance
    extends Sequelize.Instance<TaskAttributes>,
        TaskAttributes {}
