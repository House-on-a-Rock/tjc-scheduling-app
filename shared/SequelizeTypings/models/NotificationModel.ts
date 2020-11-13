import * as Sequelize from 'sequelize';
import { CommonSequelizeAttributes } from '.';

export interface NotificationAttributes extends CommonSequelizeAttributes {
  userId: number;
  message: string;
  requestId?: number;
  taskId?: number;
  isRead?: boolean;
}

export interface NotificationInstance
  extends Sequelize.Instance<NotificationAttributes>,
    NotificationAttributes {}
