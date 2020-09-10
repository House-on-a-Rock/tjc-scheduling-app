import * as Sequelize from 'sequelize';

export interface NotificationAttributes {
    id?: number;
    userId: number;
    message: string;
    requestId?: number;
    taskId?: number;
    isRead?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface NotificationInstance
    extends Sequelize.Instance<NotificationAttributes>,
        NotificationAttributes {}
