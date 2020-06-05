import * as Sequelize from 'sequelize';
import { SequelizeAttributes } from 'shared/SequelizeTypings/typings/SequelizeAttributes';
import { TokenInstance, TokenAttributes } from 'shared/SequelizeTypings/models';

const TokenFactory = (
    sequelize: Sequelize.Sequelize,
    DataTypes: Sequelize.DataTypes,
): Sequelize.Model<TokenInstance, TokenAttributes> => {
    const attributes: SequelizeAttributes<TokenAttributes> = {
        _userId: { type: DataTypes.INTEGER },
        token: { type: DataTypes.STRING },
        expiresIn: {
            type: DataTypes.DATE,
            defaultValue: Math.floor(Date.now() / 1000) + 60,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: Math.floor(Date.now() / 1000),
        },
    };

    const Token = sequelize.define<TokenInstance, TokenAttributes>('Token', attributes);

    return Token;
};

export default TokenFactory;
