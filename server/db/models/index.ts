import Sequelize from 'sequelize';
import { DbInterface } from 'shared/SequelizeTypings/typings/DbInterface';
import ChurchFactory from './Church';
import UserFactory from './User';
import TaskFactory from './Task';
import RoleFactory from './Role';
import TeamFactory from './Team';
import UserRoleFactory from './User_Role';

const createModels = (database, username, password, config): DbInterface => {
    const sequelize = new Sequelize(database, username, password, config);

    const db: DbInterface = {
        sequelize,
        Sequelize,
        Church: ChurchFactory(sequelize, Sequelize),
        User: UserFactory(sequelize, Sequelize),
        Task: TaskFactory(sequelize, Sequelize),
        Role: RoleFactory(sequelize, Sequelize),
        Team: TeamFactory(sequelize, Sequelize),
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
