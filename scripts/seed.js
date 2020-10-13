/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
import { churches, notifications, roles, tasks, dividers, users, userRoles, schedules, events } from './database';

const { green, red, blue } = require('chalk');
const createModels = require('../server/db/models').default;

const configuration = {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,
};

const db = createModels(configuration.database, configuration.username, configuration.password, configuration);

async function seed() {
    await db.sequelize.sync({ force: true });
    console.log(green('db synced!'));

    const seedChurches = await db.Church.bulkCreate(churches);
    const seedSchedules = await db.Schedule.bulkCreate(schedules);
    const seedDividers = await db.Divider.bulkCreate(dividers);

    const seedUsers = await db.User.bulkCreate(users);
    // new change breaks salt generation
    const seedRoles = await db.Role.bulkCreate(roles);
    const seedEvents = await db.Event.bulkCreate(events);
    const seedUserRoles = await db.UserRole.bulkCreate(userRoles);
    const seedTasks = await db.Task.bulkCreate(tasks);
    const seedNotifications = await db.Notification.bulkCreate(notifications);

    console.log(blue(`seeded ${seedChurches.length} churches`));
    console.log(blue(`seeded ${seedSchedules.length} schedules`));
    console.log(blue(`seeded ${seedDividers.length} dividers`));
    console.log(blue(`seeded ${seedUsers.length} users`));
    console.log(blue(`seeded ${seedRoles.length} roles`));
    console.log(blue(`seeded ${seedEvents.length} events`));
    console.log(blue(`seeded ${seedUserRoles.length} user roles`));
    console.log(blue(`seeded ${seedTasks.length} tasks`));
    console.log(blue(`seeded ${seedNotifications.length} notifications`));
    console.log(blue(`seeded succesfully`));
}

async function runSeed() {
    console.log('seeding...');
    try {
        await seed();
    } catch (err) {
        console.error(red('Oh noes! Something went wrong!'));
        console.error(err);
    } finally {
        console.log('closing db connection');
        console.log('db connection closed');
    }
}

runSeed();
