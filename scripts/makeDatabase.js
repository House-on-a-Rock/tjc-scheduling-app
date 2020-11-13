/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
const fs = require('fs');
const { SCHEDULE } = require('./webDatabase');

const dayToIndex = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

function makeUserDetails(name, id) {
  const firstName = name.split(' ')[0];
  const lastName = name.split(' ')[1];
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@gmail.com`;
  return {
    id: id + 1,
    firstName,
    lastName,
    email,
    password: id !== 1 ? `password${id - 1}` : 'password',
    isVerified: true,
    churchId: 2,
    expoPushToken: 'ExponentPushToken[-uuepvN27WLr5fHqJoK3y8]',
  };
}

const teamLeads = {
  'Church Council': 'Kevin Wang',
  'Hymn Leader': 'Shaun Tung',
  Pianist: 'Shenney Lin',
  Interpreter: 'Joseph Wu',
};

function dataToData(schedules) {
  const data = {
    schedules: [],
    services: [],
    events: [],
    tasks: [],
    userRoles: [],
    users: [],
    roles: [],
  };
  let userRoleCount = 1;
  let usersCount = 0;
  let rolesCount = 0;
  const userRolesCache = {};
  const usersCache = {};
  const rolesCache = {};

  schedules.map((schedule) => {
    const {
      view,
      services,
      title: scheduleTitle,
      start: scheduleStart,
      end: scheduleEnd,
    } = schedule;
    const scheduleObj = {
      churchId: 2,
      title: scheduleTitle,
      view,
      start: scheduleStart,
      end: scheduleEnd,
    };
    data.schedules.push(scheduleObj);
    let eventSum = 0;
    services.map((service, serviceIdx) => {
      if (service.name !== 'Specific') {
        const { events } = service;
        if (serviceIdx > 0) eventSum += services[serviceIdx - 1].events.length;
        const timeCache = {};
        events.map((event, eventId) => {
          const { time, day, title, team, tasks } = event;
          // creates roles data
          if (!rolesCache[team]) {
            rolesCount++;
            rolesCache[team] = rolesCount;
            data.roles.push({ id: rolesCount, name: team, churchId: 2 });
          }
          tasks.map((task) => {
            if (title !== 'Cooking') {
              const { assignee, date } = task;
              // creates users data
              if (!usersCache[assignee]) {
                usersCount++;
                usersCache[assignee] = { usersCount };
                data.users.push(makeUserDetails(assignee, usersCount));
              }
              const userId = data.users.filter(
                (el) => `${el.firstName} ${el.lastName}` === assignee,
              )[0].id;

              // creates userRoles data
              const teamLead = teamLeads[team] === assignee;

              const roleId = rolesCache[team];
              if (!userRolesCache[userId] || !userRolesCache[userId][roleId]) {
                const userRoleId = userRoleCount;
                userRolesCache[userId] = {
                  ...userRolesCache[userId],
                  [roleId]: { teamLead, userRoleId },
                };
                data.userRoles.push({ userRoleId, teamLead, roleId, userId });
                userRoleCount++;
              }

              data.tasks.push({
                userId,
                date,
                eventId: serviceIdx > 0 ? eventSum + eventId + 1 : eventId + 1,
              });
            }
          });

          // creates events data
          let displayTime = false;
          if (!timeCache[time]) {
            timeCache[time] = true;
            displayTime = true;
          }

          const eventObj = {
            serviceId: serviceIdx + 1,
            roleId: rolesCache[team],
            day: dayToIndex[day],
            title,
            time,
            order: eventId + 1,
            displayTime,
          };

          data.events.push(eventObj);
        });

        const serviceObj = {
          scheduleId: 1,
          name: service.name,
          day: service.day,
          start: service.start,
          end: service.end,
          order: service.order,
        };
        data.services.push(serviceObj);
      }
    });
  });
  // data.userRoles.map((userRole) => {
  //     const { teamLead, roleId, userId, userRoleId } = userRole;
  //     const user = data.users.filter((el) => el.id === userId)[0];
  //     const role = data.roles.filter((el) => el.id === roleId)[0];
  //     console.log(userRoleId, user.firstName, user.lastName, role.name, 'teamLead:', teamLead);
  // });

  const returnString = JSON.stringify(data);
  fs.writeFile('data.json', returnString, function (err) {
    if (err) console.log('error', err);
  });
}

dataToData(SCHEDULE);
