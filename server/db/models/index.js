import Sequelize from 'sequelize';
import ChurchFactory from './Church';
import EventFactory from './Event';
import RequestFactory from './Request';
import RoleFactory from './Role';
import NotificationFactory from './Notification';
import ScheduleFactory from './Schedule';
import TaskFactory from './Task';
import ServiceFactory from './Services';
import UserFactory from './User';
import UserRoleFactory from './User_Role';
import TokenFactory from './Token';
import TemplateFactory from './Template';

const createModels = (database, username, password, config) => {
  const sequelize = new Sequelize(database, username, password, config);

  const db = {
    sequelize,
    Sequelize,
    Church: ChurchFactory(sequelize, Sequelize),
    Event: EventFactory(sequelize, Sequelize),
    Notification: NotificationFactory(sequelize, Sequelize),
    Request: RequestFactory(sequelize, Sequelize),
    Role: RoleFactory(sequelize, Sequelize),
    Schedule: ScheduleFactory(sequelize, Sequelize),
    Task: TaskFactory(sequelize, Sequelize),
    Service: ServiceFactory(sequelize, Sequelize),
    Token: TokenFactory(sequelize, Sequelize),
    User: UserFactory(sequelize, Sequelize),
    UserRole: UserRoleFactory(sequelize, Sequelize),
    Template: TemplateFactory(sequelize, Sequelize),
  };

  Object.keys(db).forEach((modelName) => {
    if (!['sequelize', 'Sequelize'].includes(modelName)) {
      const { associate } = db[modelName];
      if (associate) associate(db);
    }
  });

  return db;
};

export default createModels;
