import { churches, notifications, roles, tasks, teams, users, userRoles } from './database';

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

    const seedChurches = await Promise.all(churches.map((church) => db.Church.create(church)));
    await new Promise((r) => setTimeout(r, 2000));

    const seedUsers = await Promise.all(users.map((user) => db.User.create(user)));
    await new Promise((r) => setTimeout(r, 2000));

    const seedRoles = await Promise.all(roles.map((role) => db.Role.create(role)));
    await new Promise((r) => setTimeout(r, 2000));

    const seedTasks = await Promise.all(tasks.map((task) => db.Task.create(task)));
    await new Promise((r) => setTimeout(r, 2000));

    const seedTeams = await Promise.all(teams.map((team) => db.Team.create(team)));
    await new Promise((r) => setTimeout(r, 2000));

    const seedUserRole = await Promise.all(userRoles.map((userRole) => db.UserRole.create(userRole)));
    await new Promise((r) => setTimeout(r, 2000));

    const seedNotifications = await Promise.all(
        notifications.map((notification) => db.Notification.create(notification)),
    );

    console.log(blue(`seeded ${seedChurches.length} churches`));
    console.log(blue(`seeded ${seedUsers.length} users`));
    console.log(blue(`seeded ${seedRoles.length} roles`));
    console.log(blue(`seeded ${seedTasks.length} tasks`));
    console.log(blue(`seeded ${seedTeams.length} teams`));
    console.log(blue(`seeded ${seedUserRole.length} user roles`));
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
