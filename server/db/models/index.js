import Sequelize from 'sequelize';

import AvailabilityFactory from './Availability';
import ChurchFactory from './Church';
import EventFactory from './Event';
import NotificationFactory from './Notification';
import RequestFactory from './Request';
import RoleFactory from './Role';
import ScheduleFactory from './Schedule';
import ServiceFactory from './Services';
import TaskFactory from './Task';
import TemplateFactory from './Template';
import TokenFactory from './Token';
import UserFactory from './User';
import UserAvailabilityFactory from './User_Availability';
import UserRoleFactory from './User_Role';

const createModels = (database, username, password, config) => {
  const sequelize = new Sequelize(database, username, password, config);

  const db = {
    sequelize,
    Sequelize,
    Availability: AvailabilityFactory(sequelize, Sequelize),
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
    UserAvailability: UserAvailabilityFactory(sequelize, Sequelize),
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
