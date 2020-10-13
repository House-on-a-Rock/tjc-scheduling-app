import * as Sequelize from 'sequelize';
import { UserAttributes } from './UserModel';
import { RoleAttributes } from './RoleModel';
import { CommonSequelizeAttributes } from '.';

export interface UserRoleAttributes extends CommonSequelizeAttributes {
    userId?: UserAttributes['id'];
    roleId?: RoleAttributes | RoleAttributes['id'];
    team_lead: boolean;
}

export interface UserRoleInstance extends Sequelize.Instance<UserRoleAttributes>, UserRoleAttributes {}
