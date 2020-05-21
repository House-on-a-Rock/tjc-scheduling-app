import * as Sequelize from 'sequelize';
import { UserAttributes } from './UserModel';

export interface RoleAttributes {
    id?: number;
    name: string;
    time: Date;
    createdAt?: Date;
    updatedAt?: Date;
    churchId?: number;
    member?: UserAttributes[] | UserAttributes['id'];
}

export interface RoleInstance
    extends Sequelize.Instance<RoleAttributes>,
        RoleAttributes {}
