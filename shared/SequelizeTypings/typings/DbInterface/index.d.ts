import * as Sequelize from 'sequelize';
import {
    ChurchAttributes,
    ChurchInstance,
    EventAttributes,
    EventInstance,
    EventTaskAttributes,
    EventTaskInstance,
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
    TeamInstance,
    TeamAttributes,
    TokenAttributes,
    TokenInstance,
    UserAttributes,
    UserInstance,
    UserRoleAttributes,
    UserRoleInstance,
} from 'shared/SequelizeTypings/models';

export interface DbInterface {
    sequelize: Sequelize.Sequelize;
    Sequelize: Sequelize.SequelizeStatic;
    Church: Sequelize.Model<ChurchInstance, ChurchAttributes>;
    Event: Sequelize.Model<EventInstance, EventAttributes>;
    EventTask: Sequelize.Model<EventTaskInstance, EventTaskAttributes>;
    Notification: Sequelize.Model<NotificationInstance, NotificationAttributes>;
    Request: Sequelize.Model<RequestInstance, RequestAttributes>;
    Role: Sequelize.Model<RoleInstance, RoleAttributes>;
    Schedule: Sequelize.Model<ScheduleInstance, ScheduleAttributes>;
    Task: Sequelize.Model<TaskInstance, TaskAttributes>;
    Team: Sequelize.Model<TeamInstance, TeamAttributes>;
    Token: Sequelize.Model<TokenInstance, TokenAttributes>;
    User: Sequelize.Model<UserInstance, UserAttributes>;
    UserRole: Sequelize.Model<UserRoleInstance, UserRoleAttributes>;
}
