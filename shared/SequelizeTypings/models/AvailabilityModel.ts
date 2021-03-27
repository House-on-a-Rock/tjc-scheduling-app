import * as Sequelize from 'sequelize';
import { CommonSequelizeAttributes } from '.';

export interface AvailabilityAttributes extends CommonSequelizeAttributes {
  userId?: number;
  churchId?: number;
  dateRange?: string;
  unavailablities?: string;
}

export interface AvailabilityInstance
  extends Sequelize.Instance<AvailabilityAttributes>,
    AvailabilityAttributes {}
