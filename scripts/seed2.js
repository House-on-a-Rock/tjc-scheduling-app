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
    },
    {
        name: 'Philadelphia',
        address: '660 E Township Line Road, Havertown PA 19083',
        description: 'A church in Philly',
    },
    {
        name: 'Elizabeth',
        address: '339 Elmora Ave, Elizabeth NJ 07208',
        description: 'Another church in New Jersey',
    },
    {
        name: 'Adams Road',
        address: '17D Adam Rd, Singapore 289890',
        description: 'Biggest church in Singapore',
    },
    {
        name: 'Toronto',
        address: '69 Sunrise Ave, North York, ON M4A 1A9, Canada',
        description: 'Biggest church in East Canada',
    },
    {
        name: 'San Diego',
        address: '8081 Mira Mesa Blvd, San Diego, CA 92126',
        description: 'House of Prayer in SD',
    },
];

const users = [
    {
        firstName: 'Shaun',
        lastName: 'Tung',
        email: 'shaun.tung@gmail.com',
        password: 'password',
        ChurchId: 2,
    },
    {
        firstName: 'Ted',
        lastName: 'Chen',
        email: 'ted.chen@gmail.com',
        password: 'password1',
        ChurchId: 1,
    },
    {
        firstName: 'Jonathan',
        lastName: 'Lee',
        email: 'Jonathan.Lee@gmail.com',
        password: 'password3',
        ChurchId: 6,
    },
    {
        firstName: 'Geoff',
        lastName: 'Chu',
        email: 'Geoff.Chu@gmail.com',
        password: 'password3',
        ChurchId: 3,
    },
    {
        firstName: 'Amanda',
        lastName: 'Chin',
        email: 'amanda.chin@gmail.com',
        password: 'password4',
        ChurchId: 4,
    },
    {
        firstName: 'Alan',
        lastName: 'Lin',
        email: 'Alan.Lin@gmail.com',
        password: 'password5',
        ChurchId: 2,
    },
    {
        firstName: 'Ian',
        lastName: 'Lin',
        email: 'Ian.Lin@gmail.com',
        password: 'password6',
        ChurchId: 5,
    },
];

const roles = [
    {
        name: 'AV',
        ChurchId: 1,
    },
    {
        name: 'Speaker',
        ChurchId: 1,
    },
    {
        name: 'Interpreting',
        ChurchId: 1,
    },
    {
        name: 'RE',
        ChurchId: 1,
    },
];
const tasks = [
    {
        date: '2020-05-06',
        UserId: 1,
        RoleId: 2,
        ChurchId: 3,
    },
    {
        date: '2020-05-06',
        UserId: 2,
        RoleId: 2,
        ChurchId: 1,
    },
    {
        date: '2020-05-06',
        UserId: 3,
        RoleId: 3,
        ChurchId: 1,
    },
    {
        date: '2020-04-06',
        UserId: 1,
        RoleId: 3,
        ChurchId: 1,
    },
    {
        date: '2020-05-12',
        UserId: 1,
        RoleId: 2,
        ChurchId: 1,
    },
    {
        date: '2020-05-16',
        UserId: 1,
        RoleId: 1,
        ChurchId: 1,
    },
    {
        date: '2020-05-16',
        UserId: 1,
        RoleId: 2,
        ChurchId: 1,
    },
    {
        date: '2020-05-16',
        UserId: 1,
        RoleId: 3,
        ChurchId: 1,
    },
    {
        date: '2020-05-16',
        UserId: 1,
        RoleId: 1,
        ChurchId: 2,
    },
    {
        date: '2020-06-01',
        UserId: 1,
        RoleId: 3,
        ChurchId: 1,
    },
    {
        date: '2020-05-21',
        UserId: 1,
        RoleId: 4,
        ChurchId: 1,
    },
];

const teams = [
    {
        name: 'RE Team',
        type: 'organized',
        RoleId: 4,
        ChurchId: 1,
    },
    {
        name: 'AV Team',
        type: 'unorganized',
        RoleId: 4,
        ChurchId: 1,
    },
];

const user_role = [
    {
        UserId: 3,
        RoleId: 1,
        TeamId: 2,
        team_lead: false,
    },
    {
        UserId: 3,
        RoleId: 2,
        TeamId: 1,
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
        user_role.map((userRole) => {
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
