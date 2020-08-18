import * as Sequelize from 'sequelize';
import { SequelizeAttributes } from 'shared/SequelizeTypings/typings/SequelizeAttributes';
import { TokenInstance, TokenAttributes } from 'shared/SequelizeTypings/models';
// eslint-disable-next-line import/no-cycle
import helper from '../../helper_functions';

const TokenFactory = (
    sequelize: Sequelize.Sequelize,
    DataTypes: Sequelize.DataTypes,
): Sequelize.Model<TokenInstance, TokenAttributes> => {
    const attributes: SequelizeAttributes<TokenAttributes> = {
        userId: { type: DataTypes.INTEGER },
        token: { type: DataTypes.STRING },
        expiresIn: {
            type: DataTypes.DATE,
            defaultValue: helper.addMinutes(new Date(), 30),
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
