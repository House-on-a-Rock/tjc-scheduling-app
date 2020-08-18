import * as Sequelize from 'sequelize';
import { RoleAttributes } from './RoleModel';
import { ChurchAttributes } from './ChurchModel';

export interface UserAttributes {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    salt?: string;
    isVerified: boolean;
    loginAttempts?: number;
    loginTimeout?: Date;
    churchId?: number;
    disabled: boolean;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    duty?: RoleAttributes[] | RoleAttributes['id'];
    church?: ChurchAttributes;
    expoPushToken?: string;
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
