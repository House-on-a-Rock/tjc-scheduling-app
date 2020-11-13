import * as Sequelize from 'sequelize';
import { CommonSequelizeAttributes } from '.';

export interface ServiceAttributes extends CommonSequelizeAttributes {
  name: string;
  order: number;
  scheduleId?: number;
  day: number;
}

export interface ServiceInstance
  extends Sequelize.Instance<ServiceAttributes>,
    ServiceAttributes {}
