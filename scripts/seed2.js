import helper from '../server/helper_functions';

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

const db = createModels(
    configuration.database,
    configuration.username,
    configuration.password,
    configuration,
);

const churches = [
    {
        name: 'Hillsborough',
        address: '335 Amwell Road, Hillsborough NJ 08844',
        description: 'A church in New Jersey',
        timeZone: 'America/New_York',
    },
    {
        name: 'Philadelphia',
        address: '660 E Township Line Road, Havertown PA 19083',
        description: 'A church in Philly',
        timeZone: 'America/New_York',
    },
    {
        name: 'Elizabeth',
        address: '339 Elmora Ave, Elizabeth NJ 07208',
        description: 'Another church in New Jersey',
        timeZone: 'America/New_York',
    },
    {
        name: 'Adams Road',
        address: '17D Adam Rd, Singapore 289890',
        description: 'Biggest church in Singapore',
        timeZone: 'Asia/Singapore',
    },
    {
        name: 'Toronto',
        address: '69 Sunrise Ave, North York, ON M4A 1A9, Canada',
        description: 'Biggest church in East Canada',
        timeZone: 'America/Toronto',
    },
    {
        name: 'San Diego',
        address: '8081 Mira Mesa Blvd, San Diego, CA 92126',
        description: 'House of Prayer in SD',
        timeZone: 'America/Los_Angeles',
    },
];

const users = [
    {
        firstName: 'Shaun',
        lastName: 'Tung',
        email: 'shaun.tung@gmail.com',
        password: 'password',
        isVerified: true,
        churchId: 2,
        expoPushToken: null,
    },
    {
        firstName: 'Ted',
        lastName: 'Chen',
        email: 'ted.chen@gmail.com',
        password: 'password1',
        isVerified: false,
        churchId: 1,
    },
    {
        firstName: 'Jonathan',
        lastName: 'Lee',
        email: 'jonathan.lee@gmail.com',
        password: 'password3',
        isVerified: true,
        churchId: 6,
        expoPushToken: 'ExponentPushToken[2CkbA5CQcxyiSNWT1oGvhC]',
    },
    {
        firstName: 'Geoff',
        lastName: 'Chu',
        email: 'geoff.chu@gmail.com',
        password: 'password3',
        isVerified: true,
        churchId: 3,
    },
    {
        firstName: 'Amanda',
        lastName: 'Chin',
        email: 'amanda.chin@gmail.com',
        password: 'password4',
        isVerified: true,
        churchId: 4,
    },
    {
        firstName: 'Alan',
        lastName: 'Lin',
        email: 'alan.lin@gmail.com',
        password: 'password5',
        isVerified: true,
        churchId: 2,
    },
    {
        firstName: 'Ian',
        lastName: 'Lin',
        email: 'ian.lin@gmail.com',
        password: 'password6',
        isVerified: true,
        churchId: 5,
    },
];

const roles = [
    {
        name: 'AV',
        churchId: 1,
    },
    {
        name: 'Speaker',
        churchId: 1,
    },
    {
        name: 'Interpreting',
        churchId: 1,
    },
    {
        name: 'RE',
        churchId: 1,
    },
];
const tasks = [
    {
        date: helper.setDate('2020-05-06', '10:30:00', 'America/New_York').toString(),
        userId: 1,
        roleId: 2,
        churchId: 3,
    },
    {
        date: helper.setDate('2020-05-06', '10:30:00', 'America/New_York').toString(),
        userId: 2,
        roleId: 2,
        churchId: 4,
    },
    {
        date: helper.setDate('2020-05-06', '10:30:00', 'America/New_York').toString(),
        userId: 3,
        roleId: 3,
        churchId: 1,
    },
    {
        date: helper.setDate('2020-04-06', '10:30:00', 'America/New_York').toString(),
        userId: 2,
        roleId: 3,
        churchId: 4,
    },
    {
        date: helper.setDate('2020-05-12', '10:30:00', 'America/New_York').toString(),
        userId: 2,
        roleId: 2,
        churchId: 4,
    },
    {
        date: helper.setDate('2020-05-16', '10:30:00', 'America/New_York').toString(),
        userId: 1,
        roleId: 1,
        churchId: 3,
    },
    {
        date: helper.setDate('2020-05-16', '10:30:00', 'America/New_York').toString(),
        userId: 1,
        roleId: 2,
        churchId: 3,
    },
    {
        date: helper.setDate('2020-05-16', '10:30:00', 'America/New_York').toString(),
        userId: 1,
        roleId: 3,
        churchId: 3,
    },
    {
        date: helper.setDate('2020-05-16', '10:30:00', 'America/New_York').toString(),
        userId: 1,
        roleId: 1,
        churchId: 3,
    },
    {
        date: helper.setDate('2020-06-01', '10:30:00', 'America/New_York').toString(),
        userId: 1,
        roleId: 3,
        churchId: 3,
    },
    {
        date: helper.setDate('2020-05-21', '10:30:00', 'America/New_York').toString(),
        userId: 1,
        roleId: 4,
        churchId: 3,
    },
];

const teams = [
    {
        name: 'RE Team',
        type: 'organized',
        roleId: 4,
        churchId: 1,
    },
    {
        name: 'AV Team',
        type: 'unorganized',
        roleId: 4,
        churchId: 1,
    },
];

const userRoles = [
    {
        userId: 3,
        roleId: 1,
        teamId: 2,
        team_lead: false,
    },
    {
        userId: 3,
        roleId: 2,
        teamId: 1,
        team_lead: false,
    },
    {
        userId: 2,
        roleId: 3,
        teamId: 1,
        team_lead: false,
    },
    {
        userId: 4,
        roleId: 1,
        teamId: 1,
        team_lead: false,
    },
    {
        userId: 1,
        roleId: 2,
        teamId: 1,
        team_lead: false,
    },
    {
        userId: 1,
        roleId: 3,
        teamId: 1,
        team_lead: false,
    },
];

async function seed() {
    await db.sequelize.sync({ force: true });
    console.log(green('db synced!'));

    const seedChurches = await Promise.all(
        churches.map((church) => {
            db.Church.create(church);
        }),
    );
    await new Promise((r) => setTimeout(r, 2000));
    const seedUsers = await Promise.all(
        users.map((user) => {
            db.User.create(user);
        }),
    );
    await new Promise((r) => setTimeout(r, 2000));
    const seedRoles = await Promise.all(
        roles.map((role) => {
            db.Role.create(role);
        }),
    );
    await new Promise((r) => setTimeout(r, 2000));
    const seedTasks = await Promise.all(
        tasks.map((task) => {
            db.Task.create(task);
        }),
    );
    await new Promise((r) => setTimeout(r, 2000));
    const seedTeams = await Promise.all(
        teams.map((team) => {
            db.Team.create(team);
        }),
    );
    await new Promise((r) => setTimeout(r, 2000));
    const seedUserRole = await Promise.all(
        userRoles.map((userRole) => {
            db.UserRole.create(userRole);
        }),
    );

    console.log(blue(`seeded ${seedChurches.length} churches`));
    console.log(blue(`seeded ${seedUsers.length} users`));
    console.log(blue(`seeded ${seedRoles.length} roles`));
    console.log(blue(`seeded ${seedTasks.length} tasks`));
    console.log(blue(`seeded ${seedTeams.length} teams`));
    console.log(blue(`seeded ${seedUserRole.length} user roles`));
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
// module.exports = seed;
