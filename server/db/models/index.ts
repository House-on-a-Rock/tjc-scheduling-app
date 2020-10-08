import Sequelize from 'sequelize';
import { DbInterface } from 'shared/SequelizeTypings/typings/DbInterface';
import ChurchFactory from './Church';
import EventFactory from './Event';
import EventTaskFactory from './Event_Task';
import RequestFactory from './Request';
import RoleFactory from './Role';
import NotificationFactory from './Notification';
import ScheduleFactory from './Schedule';
import TaskFactory from './Task';
import TeamFactory from './Team';
import UserFactory from './User';
import UserRoleFactory from './User_Role';
import TokenFactory from './Token';

const createModels = (database, username, password, config): DbInterface => {
    const sequelize = new Sequelize(database, username, password, config);

    const db: DbInterface = {
        sequelize,
        Sequelize,
        Church: ChurchFactory(sequelize, Sequelize),
        Event: EventFactory(sequelize, Sequelize),
        EventTask: EventTaskFactory(sequelize, Sequelize),
        Notification: NotificationFactory(sequelize, Sequelize),
        Request: RequestFactory(sequelize, Sequelize),
        Role: RoleFactory(sequelize, Sequelize),
        Schedule: ScheduleFactory(sequelize, Sequelize),
        Task: TaskFactory(sequelize, Sequelize),
        Team: TeamFactory(sequelize, Sequelize),
        Token: TokenFactory(sequelize, Sequelize),
        User: UserFactory(sequelize, Sequelize),
        UserRole: UserRoleFactory(sequelize, Sequelize),
    };

    Object.keys(db).forEach((modelName) => {
        if (db[modelName].associate) {
            db[modelName].associate(db);
        }
    });

    return db;
};

export default createModels;
