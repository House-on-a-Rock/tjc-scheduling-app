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
        firstName: {
            type: DataTypes.STRING,
        },
        lastName: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
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
        loginTimeout: {
            type: DataTypes.DATE,
        },
        salt: {
            type: DataTypes.STRING,
        },
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
    };

    const User = sequelize.define<UserInstance, UserAttributes>('User', attributes) as UserModel;

    User.prototype.verifyPassword = function (candidatePwd: string): boolean {
        return User.encryptPassword(candidatePwd, this.salt) === this.password;
    };

    User.generateSalt = function () {
        return crypto.randomBytes(16).toString('base64');
    };

    User.encryptPassword = function (plainText, salt) {
        return crypto.createHash(process.env.SECRET_HASH).update(plainText).update(salt).digest('hex');
    };

    const createSaltyPassword = (user: UserInstance) => {
        if (user.changed('password')) {
            const verySalty = User.generateSalt();
            user.salt = verySalty;
            user.password = User.encryptPassword(user.password, verySalty);
        }
    };

    User.beforeCreate(createSaltyPassword);
    User.beforeUpdate(createSaltyPassword);

    User.associate = (models) => {
        User.hasMany(models.Task, { foreignKey: 'userId' });
        User.belongsTo(models.Church, { as: 'church', foreignKey: 'churchId' });
        // User.belongsToMany(models.Role, {
        //     through: models.UserRole,
        //     as: 'user',
        //     foreignKey: 'userId',
        // });
    };

    return User;
};

export default UserFactory;
