function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

const TokenFactory = (sequelize, DataTypes) => {
  const attributes = {
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

  const Token = sequelize.define('Token', attributes);

  return Token;
};

export default TokenFactory;
