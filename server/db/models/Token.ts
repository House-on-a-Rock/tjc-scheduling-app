import * as Sequelize from 'sequelize';
import { SequelizeAttributes } from 'shared/SequelizeTypings/typings/SequelizeAttributes';
import { TokenInstance, TokenAttributes } from 'shared/SequelizeTypings/models';

const TokenFactory = (
    sequelize: Sequelize.Sequelize,
    DataTypes: Sequelize.DataTypes,
): Sequelize.Model<TokenInstance, TokenAttributes> => {
    const attributes: SequelizeAttributes<TokenAttributes> = {
        userId: { type: DataTypes.INTEGER },
        token: { type: DataTypes.STRING },
        expiresIn: {
            type: DataTypes.DATE,
            defaultValue: Date.now() + 30 * 60 * 1000,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: Date.now(),
        },
    };

    const Token = sequelize.define<TokenInstance, TokenAttributes>('Token', attributes);

    return Token;
};

export default TokenFactory;
