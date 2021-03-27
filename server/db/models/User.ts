import * as Sequelize from 'sequelize';
import { SequelizeAttributes } from 'shared/SequelizeTypings/typings/SequelizeAttributes';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { UserAttributes, UserInstance, UserModel } from 'shared/SequelizeTypings/models';

dotenv.config();

const UserFactory = (
  sequelize: Sequelize.Sequelize,
  DataTypes: Sequelize.DataTypes,
): Sequelize.Model<UserInstance, UserAttributes> => {
  const attributes: SequelizeAttributes<UserAttributes> = {
    firstName: { type: DataTypes.STRING },
    lastName: { type: DataTypes.STRING },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    disabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    loginAttempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    loginTimeout: { type: DataTypes.DATE },
    salt: { type: DataTypes.STRING },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    expoPushToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    hasSubmittedAvails: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
  };

  const User = sequelize.define<UserInstance, UserAttributes>(
    'User',
    attributes,
  ) as UserModel;

  User.generateSalt = function () {
    return crypto.randomBytes(16).toString('base64');
  };

  User.encryptPassword = function (plainText, salt) {
    const hash = process.env.SECRET_HASH ?? '';
    return crypto.createHash(hash).update(plainText).update(salt).digest('hex');
  };

  const createSaltyPassword = (user: UserInstance) => {
    if (user.changed('password')) {
      const verySalty = User.generateSalt();
      user.salt = verySalty;
      user.password = User.encryptPassword(user.password, verySalty);
    }
  };

  User.beforeBulkCreate((users: UserInstance[]) =>
    users.map((user) => createSaltyPassword(user)),
  );
  User.beforeCreate(createSaltyPassword);
  User.beforeUpdate(createSaltyPassword);

  User.associate = (models) => {
    User.belongsTo(models.Church, { as: 'church', foreignKey: 'churchId' });
  };

  return User;
};

export default UserFactory;
