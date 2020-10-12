/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-plusplus */
const fs = require('fs');
const { users: databaseUsers, roles: databaseRoles, events: databaseEvents } = require('./webDatabase');

const userToId = () => {
    const mappedUsers = {};
    databaseUsers.map((user, index) => {
        mappedUsers[user.name] = index + 1;
    });
    return mappedUsers;
};

const roleToId = () => {
    const mappedRoles = {};
    databaseRoles.map((role, index) => {
        mappedRoles[role.name] = index + 1;
    });
    return mappedRoles;
};

function makeUserDetails(users) {
    const allUsers = users.map((user, idx) => {
        const firstName = user.name.split(' ')[0];
        const lastName = user.name.split(' ')[1];
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@gmail.com`;
        return {
            firstName,
            lastName,
            email,
            password: `password${idx}`,
            isVerified: true,
            churchId: 2,
            expoPushToken: 'ExponentPushToken[-uuepvN27WLr5fHqJoK3y8]',
        };
    });
    return allUsers;
}
// makeUserDetails(databaseUsers)

function makeUserRoles(events) {
    const cache = {};
    let count = 0;
    for (let i = 0; i < events.length; i++) {
        const { tasks } = events[i];
        for (let j = 0; j < tasks.length; j++) {
            const { title, data, role } = tasks[j];
            for (let k = 0; k < data.length; k++) {
                if (title !== 'Cooking') {
                    const { assignee } = data[k];
                    const userId = userToId()[assignee];
                    const roleId = roleToId()[role];
                    if (!cache[userId] || !cache[userId][roleId]) {
                        cache[userId] = { ...cache[userId], [roleId]: true };
                    }
                }
            }
        }
    }
    const userRoles = [];
    for (let userId = 1; userId < Object.keys(cache).length + 1; userId++) {
        const roleIds = Object.keys(cache[userId]);
        for (let idx = 0; idx < roleIds.length; idx++) {
            count++;
            const roleId = parseInt(roleIds[idx], 10);
            userRoles.push({ roleId: roleId, userId: userId, userRoleId: count });
        }
    }
    return userRoles;
}
// makeUserRoles(databaseEvents);

function makeTasksFromEvents(eventData) {
    const tasks = [];
    const userRoles = makeUserRoles(eventData);
    for (let i = 0; i < eventData.length; i++) {
        const { tasks: eventTasks } = eventData[i];
        for (let j = 0; j < eventTasks.length; j++) {
            const { title, data, role } = eventTasks[j];
            for (let k = 0; k < data.length; k++) {
                if (title !== 'Cooking') {
                    const { assignee, date } = data[k];
                    const userId = userToId()[assignee];
                    const roleId = roleToId()[role];
                    const { userRoleId } = userRoles.filter(
                        (userRole) => userId === userRole.userId && roleId === userRole.roleId,
                    )[0];

                    tasks.push({ userRoleId, date, churchId: 2 });
                }
            }
        }
    }
    const taskstring = JSON.stringify(tasks);
    fs.writeFile('tasks.json', taskstring, function (err) {
        if (err) console.log('error', err);
    });
    return tasks;
}

makeTasksFromEvents(databaseEvents);

// {
//     date: setDate('2020-08-21', '10:30:00', 'America/New_York').toString(),
//     userId: 1,
//     roleId: 1,
//     churchId: 1,
// },
