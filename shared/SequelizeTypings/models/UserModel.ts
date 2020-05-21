import * as Sequelize from 'sequelize';
import { RoleAttributes } from './RoleMOdel';

export interface UserAttributes {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    salt: string;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    duty?: RoleAttributes[] | RoleAttributes['id'];
}

export interface UserInstance
    extends Sequelize.Instance<UserAttributes>,
        UserAttributes {}

export interface UserModel extends Sequelize.Model<UserInstance, UserAttributes> {
    prototype: {
        verifyPassword: (candidatePwd: string) => boolean;
    };
    generateSalt: () => string;
    encryptPassword: (plainText: string, salt) => string;
}
