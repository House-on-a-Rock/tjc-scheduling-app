import * as Sequelize from 'sequelize';
import { CommonSequelizeAttributes } from '.';

export interface EventAttributes extends CommonSequelizeAttributes {
  serviceId: number;
  roleId?: number; // team
  title: string;
  time: string;
  order: number;
}

export interface EventInstance
  extends Sequelize.Instance<EventAttributes>,
    EventAttributes {}
