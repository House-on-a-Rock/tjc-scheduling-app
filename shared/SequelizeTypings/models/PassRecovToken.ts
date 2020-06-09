import * as Sequelize from 'sequelize';

export interface PassRecovTokenAttributes {
    id?: number;
    userId: number;
    token: string;
    expiresIn?: Date;
    createdAt?: Date;
}

export interface PassRecovTokenInstance
    extends Sequelize.Instance<PassRecovTokenAttributes>,
        PassRecovTokenAttributes {}
