import * as Sequelize from 'sequelize';

export interface TokenAttributes {
    id?: number;
    userId: number;
    token: string;
    expiresIn?: Date;
    createdAt?: Date;
}

export interface TokenInstance
    extends Sequelize.Instance<TokenAttributes>,
        TokenAttributes {}
