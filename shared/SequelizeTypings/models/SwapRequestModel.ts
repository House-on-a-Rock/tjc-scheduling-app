import * as Sequelize from 'sequelize';

export interface SwapRequestAttributes {
    id?: number;
    requesteeUserId: number;
    type: string;
    TaskId?: number;
    accepted?: boolean;
    approved?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface SwapRequestInstance
    extends Sequelize.Instance<SwapRequestAttributes>,
        SwapRequestAttributes {}
