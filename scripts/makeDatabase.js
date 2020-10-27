/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
const fs = require('fs');
const { users: databaseUsers, roles: databaseRoles, events: databaseEvents, SCHEDULE } = require('./webDatabase');

const userToIdFn = () => {
    const mappedUsers = {};
    databaseUsers.map((user, index) => (mappedUsers[user.name] = index++));
    return mappedUsers;
};

const userToId = userToIdFn();

const roleToIdFn = () => {
    const mappedRoles = {};
    databaseRoles.map((role, index) => (mappedRoles[role.name] = index++));
    return mappedRoles;
};

const roleToId = roleToIdFn();

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
                    const userId = userToId[assignee];
                    const roleId = roleToId[role];
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
    // fs.writeFile('tasks.json', taskstring, function (err) {
    //     if (err) console.log('error', err);
    // });
    return [tasks, userRoles];
}

// makeTasksFromEvents(databaseEvents);

function makeNewUserRoles(events) {
    const cache = {};
    events.map((event) => {
        const { team, tasks } = event;
        tasks.map((task) => {
            const { assignee } = task;
            const roleId = roleToId[team];
            const userId = userToId[assignee];
            if (!userId) console.log(assignee);
            if (!cache[userId] || !cache[userId][roleId]) {
                cache[userId] = { ...cache[userId], [roleId]: true };
            }
        });
    });
    let count = 0;
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

function dataToData(schedules) {
    const scheduleArr = [];
    const dividerArr = [];
    const eventArr = [];
    const taskArr = [];
    // console.log(userRoles);
    schedules.map((schedule, scheduleId) => {
        const { view, dividers, events } = schedule;
        const scheduleObj = { churchId: 2 };
        scheduleObj.title = schedule.title;
        scheduleObj.view = view;
        scheduleObj.start = schedule.start;
        scheduleObj.end = schedule.end;
        scheduleArr.push(scheduleObj);
        dividers.map((divider) => {
            if (divider.name !== 'Specific' || divider.name !== 'Specific') {
                const dividerObj = { scheduleId: 1 };
                dividerObj.name = divider.name;
                dividerObj.day = divider.day;
                dividerObj.start = divider.start;
                dividerObj.end = divider.end;
                dividerObj.order = divider.order;
                dividerArr.push(dividerObj);
            }
        });
        const userRoles = makeNewUserRoles(events);
        events.map((event, eventId) => {
            const eventObj = { scheduleId: 1 };
            const { time, day, title, team, order, tasks } = event;
            eventObj.roleId = roleToId[team];
            eventObj.day = day;
            eventObj.title = title;
            eventObj.time = time;
            eventObj.order = order;
            eventArr.push(eventObj);
            tasks.map((task) => {
                if (title !== 'Cooking') {
                    const { assignee, date } = task;
                    const userId = userToId[assignee];
                    const roleId = roleToId[team];
                    const { userRoleId } = userRoles.filter(
                        (userRole) => userId === userRole.userId && roleId === userRole.roleId,
                    )[0];

                    taskArr.push({ userRoleId, date, eventId: eventId + 1 });
                }
            });
        });
    });
    console.log(taskArr);
    const taskstring = JSON.stringify(taskArr);
    fs.writeFile('tasks.json', taskstring, function (err) {
        if (err) console.log('error', err);
    });
}

dataToData(SCHEDULE);
