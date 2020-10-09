import * as Sequelize from 'sequelize';
import {
    ChurchInstance,
    ChurchAttributes,
    UserInstance,
    UserAttributes,
    TaskInstance,
    TaskAttributes,
    RoleInstance,
    RoleAttributes,
    UserRoleInstance,
    UserRoleAttributes,
    TokenInstance,
    TokenAttributes,
    RequestInstance,
    RequestAttributes,
    NotificationAttributes,
    NotificationInstance,
} from 'shared/SequelizeTypings/models';
import { TeamInstance, TeamAttributes } from 'shared/SequelizeTypings/models/TeamModel';

export interface DbInterface {
    sequelize: Sequelize.Sequelize;
    Sequelize: Sequelize.SequelizeStatic;
    Church: Sequelize.Model<ChurchInstance, ChurchAttributes>;
    User: Sequelize.Model<UserInstance, UserAttributes>;
    Task: Sequelize.Model<TaskInstance, TaskAttributes>;
    Role: Sequelize.Model<RoleInstance, RoleAttributes>;
    Team: Sequelize.Model<TeamInstance, TeamAttributes>;
    UserRole: Sequelize.Model<UserRoleInstance, UserRoleAttributes>;
    Token: Sequelize.Model<TokenInstance, TokenAttributes>;
    Request: Sequelize.Model<RequestInstance, RequestAttributes>;
    Notification: Sequelize.Model<NotificationInstance, NotificationAttributes>;
}
