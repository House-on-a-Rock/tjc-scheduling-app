import * as Sequelize from 'sequelize';
import { ChurchAttributes } from './ChurchModel';
import { CommonSequelizeAttributes } from './index';

export interface UserAttributes extends CommonSequelizeAttributes {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isVerified: boolean;
  loginAttempts?: number;
  loginTimeout?: Date;
  salt?: string;
  churchId?: number;
  disabled: boolean;
  expoPushToken?: string;
  church?: ChurchAttributes;
  isAdmin?: boolean;
}

export interface UserInstance
  extends Sequelize.Instance<UserAttributes>,
    UserAttributes {}

export interface UserModel extends Sequelize.Model<UserInstance, UserAttributes> {
  generateSalt: () => string;
  encryptPassword: (plainText: string, salt: string) => string;
}
