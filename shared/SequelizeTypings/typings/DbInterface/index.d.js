import * as Sequelize from 'sequelize';
import {
  ChurchAttributes,
  ChurchInstance,
  EventAttributes,
  EventInstance,
  NotificationAttributes,
  NotificationInstance,
  RequestAttributes,
  RequestInstance,
  RoleAttributes,
  RoleInstance,
  ScheduleInstance,
  ScheduleAttributes,
  TaskAttributes,
  TaskInstance,
  ServiceInstance,
  ServiceAttributes,
  TokenAttributes,
  TokenInstance,
  UserAttributes,
  UserInstance,
  UserRoleAttributes,
  UserRoleInstance,
  TemplateInstance,
  TemplateAttributes,
} from 'shared/SequelizeTypings/models';

const { Model } = Sequelize;

export interface DbOptions {
  Church: string;
  Event: string;
  Notification: string;
  Request: string;
  Role: string;
  Schedule: string;
  Task: string;
  Service: string;
  Token: string;
  User: string;
  UserRole: string;
}
export interface DbInterface {
  sequelize: Sequelize.Sequelize;
  Sequelize: Sequelize.SequelizeStatic;
  Church: Model<ChurchInstance, ChurchAttributes>;
  Event: Model<EventInstance, EventAttributes>;
  Notification: Model<NotificationInstance, NotificationAttributes>;
  Request: Model<RequestInstance, RequestAttributes>;
  Role: Model<RoleInstance, RoleAttributes>;
  Schedule: Model<ScheduleInstance, ScheduleAttributes>;
  Task: Model<TaskInstance, TaskAttributes>;
  Service: Model<ServiceInstance, ServiceAttributes>;
  Token: Model<TokenInstance, TokenAttributes>;
  User: Model<UserInstance, UserAttributes>;
  UserRole: Model<UserRoleInstance, UserRoleAttributes>;
  Template: Model<TemplateInstance, TemplateAttributes>;
}
