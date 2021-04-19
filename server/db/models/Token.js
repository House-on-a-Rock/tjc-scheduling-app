import * as Sequelize from 'sequelize';
import { SequelizeAttributes } from 'shared/SequelizeTypings/typings/SequelizeAttributes';
import { TokenInstance, TokenAttributes } from 'shared/SequelizeTypings/models';

function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60000);
}

const TokenFactory = (
  sequelize: Sequelize.Sequelize,
  DataTypes: Sequelize.DataTypes,
): Sequelize.Model<TokenInstance, TokenAttributes> => {
  const attributes: SequelizeAttributes<TokenAttributes> = {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER },
    token: { type: DataTypes.STRING },
    expiresIn: {
      type: DataTypes.DATE,
      defaultValue: addMinutes(new Date(), 30),
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
