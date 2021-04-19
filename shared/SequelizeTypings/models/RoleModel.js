import * as Sequelize from 'sequelize';
import { CommonSequelizeAttributes } from '.';
import { UserAttributes } from './UserModel';

export interface RoleAttributes extends CommonSequelizeAttributes {
  name: string;
  churchId?: number;
  member?: UserAttributes[] | UserAttributes['id'];
}

export interface RoleInstance
  extends Sequelize.Instance<RoleAttributes>,
    RoleAttributes {}
