import * as Sequelize from 'sequelize';
import { CommonSequelizeAttributes } from '.';

export interface TokenAttributes extends CommonSequelizeAttributes {
  userId: number;
  token: string;
  expiresIn?: Date;
}

export interface TokenInstance
  extends Sequelize.Instance<TokenAttributes>,
    TokenAttributes {}
