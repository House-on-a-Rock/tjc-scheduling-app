export * from './ChurchModel';
export * from './EventModel';
export * from './NotificationModel';
export * from './RequestModel';
export * from './RoleModel';
export * from './ScheduleModel';
export * from './TaskModel';
export * from './ServiceModel';
export * from './TokenModel';
export * from './UserModel';
export * from './UserRoleModel';
export * from './TemplateModel';

export interface CommonSequelizeAttributes {
  id?: number;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}
