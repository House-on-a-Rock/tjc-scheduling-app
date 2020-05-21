import * as Sequelize from 'sequelize';
import { UserAttributes } from './UserModel';
import { RoleAttributes } from './RoleModel';
import { TeamAttributes } from './TeamModel';

export interface UserRoleAttributes {
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    users?: UserAttributes['id'][];
    role?: RoleAttributes | RoleAttributes['id'];
    team?: TeamAttributes | TeamAttributes['id'];
    team_lead: boolean;
}

export interface UserRoleInstance
    extends Sequelize.Instance<UserRoleAttributes>,
        UserRoleAttributes {}
