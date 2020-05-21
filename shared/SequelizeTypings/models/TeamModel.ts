import * as Sequelize from 'sequelize';
import { UserAttributes } from './UserModel';
import { RoleAttributes } from './RoleModel';
import { ChurchAttributes } from './ChurchModel';

type TeamTypes = 'organized' | 'unorganized';

export interface TeamAttributes {
    id?: number;
    name?: string;
    type: TeamTypes;
    createdAt?: Date;
    updatedAt?: Date;
    users?: UserAttributes['id'][];
    role?: RoleAttributes | RoleAttributes['id'];
    church?: ChurchAttributes | ChurchAttributes['id'];
}

export interface TeamInstance
    extends Sequelize.Instance<TeamAttributes>,
        TeamAttributes {}
