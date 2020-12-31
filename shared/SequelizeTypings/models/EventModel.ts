import * as Sequelize from 'sequelize';
import { CommonSequelizeAttributes } from '.';

export interface EventAttributes extends CommonSequelizeAttributes {
  serviceId: number;
  roleId?: number; // team
  // day: string;
  title: string;
  time: string;
  order: number;
  displayTime: boolean;
}

export interface EventInstance
  extends Sequelize.Instance<EventAttributes>,
    EventAttributes {}
