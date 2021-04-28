import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const UserFactory = (sequelize, DataTypes) => {
  const attributes = {
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

  const User = sequelize.define('User', attributes);

  User.generateSalt = function () {
    return crypto.randomBytes(16).toString('base64');
  };

  User.encryptPassword = function (plainText, salt) {
    const hash = process.env.SECRET_HASH ? process.env.SECRET_HASH : '';
    return crypto.createHash(hash).update(plainText).update(salt).digest('hex');
  };

  const createSaltyPassword = (user) => {
    if (user.changed('password')) {
      const verySalty = User.generateSalt();
      user.salt = verySalty;
      user.password = User.encryptPassword(user.password, verySalty);
    }
  };

  User.beforeBulkCreate((users) => users.map((user) => createSaltyPassword(user)));
  User.beforeCreate(createSaltyPassword);
  User.beforeUpdate(createSaltyPassword);

  User.associate = (models) => {
    User.belongsTo(models.Church, { as: 'church', foreignKey: 'churchId' });
  };

  return User;
};

export default UserFactory;
