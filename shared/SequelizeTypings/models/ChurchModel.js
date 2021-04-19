import * as Sequelize from 'sequelize';
import { CommonSequelizeAttributes } from '.';

export interface ChurchAttributes extends CommonSequelizeAttributes {
  name: string;
  address: string;
  description: string;
  timezone: string;
}

export interface ChurchInstance
  extends Sequelize.Instance<ChurchAttributes>,
    ChurchAttributes {}
