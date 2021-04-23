import nodemailer from 'nodemailer';
import crypto from 'crypto';
import jwt, { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import fs from 'fs';
import { DateTime } from 'luxon';
import db from '../index';

const privateKey = fs.readFileSync('tjcschedule.pem');
let cert;
fs.readFile('tjcschedule_pub.pem', function read(err, data) {
  if (err) throw err;
  cert = data;
});

export function certify(req, res, next) {
  try {
    const { authorization = '' } = req.headers;
    jwt.verify(authorization, cert);
    next();
  } catch (err) {
    next(err);
    const [message, status] =
      err instanceof TokenExpiredError || err instanceof JsonWebTokenError
        ? ['Unauthorized', 401]
        : ['Server error, try again later', 503];
    res.send({ message }).status(status);
  }
}

export function sendGenericEmail(username, link) {
  try {
    console.log('Sending email..');
    const transporter = nodemailer.createTransport({
      service: 'Sendgrid',
      auth: {
        user: process.env.VER_EMAIL,
        pass: process.env.VER_PASS,
      },
    });
    // send confirmation email
    const mailOptions = {
      from: 'alraneus@gmail.com',
      to: username,
      subject: 'Password Reset',
      text: `Hello,\n\n Please reset your password to your account by clicking the link: \n${link}`,
    };
    transporter.sendMail(mailOptions, function (err) {
      if (err) {
        console.log(err);
        return false;
      }
      return true;
    });
  } catch (err) {
    console.log(err);
  }
}

export function sendVerEmail(
  username,
  { hostname }, // https://github.com/getsentry/raven-node/issues/96
  token,
  api,
) {
  try {
    console.log('Sending email..');
    const message =
      api === 'confirmation'
        ? `A verification email has been sent to ${username}.`
        : `A password recovery email has been sent to ${username}.`;

    const transporter = nodemailer.createTransport({
      service: 'Sendgrid',
      auth: {
        user: process.env.VER_EMAIL,
        pass: process.env.VER_PASS,
      },
    });
    // send confirmation email
    const mailOptions = {
      from: 'shaun.tung@gmail.com',
      to: username,
      subject: 'Account Verification Token',
      text: `Hello,\n\n Please verify your account by clicking the link: \nhttp://${hostname}/api/authentication/${api}?token=${token}`,
    };
    // lets not send emails while developing for now lol
    // transporter.sendMail(mailOptions, function (err) {
    //   return !err ? console.log('success') : console.log(err.message);
    // });
    return [message, 201];
  } catch (err) {
    console.log(err);
    return ['error', 401];
  }
}

export function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

export function createToken(
  tokenType,
  userId,
  churchId,
  expiresInMinutes,
  isAdmin = false,
  roleIds = [],
) {
  console.log('Creating token');
  let mappedRoleIds = '';
  roleIds.forEach((roleId, id) => {
    if (roleId) {
      if (id === 0) mappedRoleIds += roleId.toString();
      else mappedRoleIds += `|${roleId.toString()}`;
    }
  });
  if (isAdmin) mappedRoleIds = '0';
  const token = jwt.sign(
    {
      iss: process.env.AUDIENCE,
      sub: `tjc-scheduling|${userId}|${churchId}`,
      exp: Math.floor(Date.now() / 1000) + expiresInMinutes * 60 * 60,
      type: tokenType,
      access: mappedRoleIds,
    },
    {
      key: privateKey,
      passphrase: process.env.PRIVATEKEY_PASS ?? '',
    },
    { algorithm: process.env.JWT_ALGORITHM },
  );

  return token;
}
export function createResetToken(userId, expiresInMinutes, secret) {
  console.log('Creating reset token');
  const token = jwt.sign(
    {
      iss: process.env.AUDIENCE,
      sub: `tjc-scheduling|${userId}`,
      exp: Math.floor(Date.now() / 1000) + expiresInMinutes * 60,
    },
    secret,
  );

  return token;
}
export function validateEmail(email) {
  return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

export function setDate(date, time, timeZone) {
  return DateTime.fromISO(`${date}T${time}`, { zone: timeZone });
}

export function hashPassword(password, salt) {
  const hashbrown = process.env.SECRET_HASH ?? '';
  return crypto.createHash(hashbrown).update(password).update(salt).digest('hex');
}
export function makeMyNotificationMessage(notification, type, firstName) {
  switch (notification) {
    case 'accepted':
      return `Your requested has been accepted by ${firstName}`;
    case 'approved':
      return `Your request to switch with ${firstName} has been approved`;
    case 'cancelled':
      return `Your request to switch has been cancelled`;
    case 'created':
      return type === 'requestOne'
        ? `Request sent to ${firstName}`
        : `Request sent to all local church members`;
    default:
      return 'Invalid notification type.';
  }
}

export function determineLoginId(auth = '') {
  const decodedToken = jwt.decode(auth, { json: true });
  return parseInt(decodedToken?.sub.split('|')[1], 10);
}

export function timeToMilliSeconds(time = '') {
  const [hourMin, period] = time.split(' ');
  const [hour, min] = hourMin.split(':');
  const convertedHour = hour === '12' ? 0 : 3600000 * parseInt(hour, 10);
  const convertedMin = 60000 * parseInt(min, 10);
  const convertedPeriod = period === 'AM' ? 0 : 43200000;

  return convertedHour + convertedMin + convertedPeriod;
}

export function isInTime(target, start, end) {
  const targetTime = timeToMilliSeconds(target);
  const startTime = timeToMilliSeconds(start);
  const endTime = timeToMilliSeconds(end);
  return startTime <= targetTime && targetTime <= endTime;
}

export function isTimeBefore(comparing, target) {
  const targetTime = timeToMilliSeconds(target);
  const comparingTime = timeToMilliSeconds(comparing);
  return comparingTime < targetTime;
}

const zeroPaddingDates = (date) => {
  let month = (date.getMonth() + 1).toString();
  let day = date.getDate().toString();

  month = month.length > 1 ? month : `0${month}`;
  day = day.length > 1 ? day : `0${day}`;

  return `${month}/${day}`;
};

const setStartAndEnd = (arg1, arg2) => {
  const start = new Date(arg1);
  start.setDate(start.getDate() - start.getDay()); // sets start to sunday
  const end = arg2 ? new Date(arg2) : new Date(start);
  end.setDate(end.getDate() + (6 - end.getDay()));
  return [start, end];
};

export function columnizedDates(everyRepeatingDay) {
  return everyRepeatingDay.map((date) => {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(startDate.getDate() + 6);

    return {
      Header: `${zeroPaddingDates(startDate)}-${zeroPaddingDates(endDate)}`,
      accessor: `${zeroPaddingDates(startDate)}-${zeroPaddingDates(endDate)}`,
    };
  });
}

export function determineWeeks(startDate, endDate) {
  const [start, end] = setStartAndEnd(startDate, endDate);
  const weeks = [];
  let current = new Date(start);
  while (current <= end) {
    weeks.push(new Date(current));
    current = new Date(current.setDate(current.getDate() + 7));
  }
  return weeks;
}

export function createColumns(start, end) {
  return [
    {
      Header: '',
      accessor: '',
    },
    {
      Header: 'Time',
      accessor: 'time',
    },
    {
      Header: 'Duty',
      accessor: 'duty',
    },
    ...columnizedDates(determineWeeks(start, end)),
  ];
}

export async function populateServiceData({ name, day, id }) {
  const events = await db.Event.findAll({
    where: { serviceId: id },
    order: [['order', 'ASC']],
  }); // returns events in ascending order
  const eventData = await Promise.all(
    events.map(async (event) => {
      const { time, roleId, id: eventId } = event;
      const role = await retrieveEventRole(roleId);
      const tasks = await retrieveTaskData(eventId, role);
      // changes - most of the schedule data will just be the id's, and the front end will use the ids to display the appropriate info
      return {
        time,
        roleId,
        eventId,
        cells: [{}, {}, ...tasks],
      };
    }),
  );
  return { name, day, events: eventData, serviceId: id };
}

function retrieveEventRole(roleId) {
  return db.Role.findOne({
    where: { id: roleId },
    attributes: ['id', 'name'],
  });
}

async function retrieveTaskData(eventId, role) {
  const tasks = await db.Task.findAll({
    where: { eventId },
    attributes: ['id', 'userId'],
    order: [['date', 'ASC']],
  });
  const organizedTasks = tasks.map((task) => {
    return {
      taskId: task.id,
      userId: task.userId,
    };
  });
  return organizedTasks;
}

export const recurringDaysOfWeek = (start, end, dayOfWeeK) => {
  const weeks = [];
  let startDayOfWeek = new Date(start).getDay();
  let dayModifier = dayOfWeeK - startDayOfWeek;
  if (dayModifier < 0) dayModifier += 7;
  let current = new Date(start);
  current.setDate(current.getDate() + dayModifier);
  while (current <= end) {
    weeks.push(new Date(current));
    current = new Date(current.setDate(current.getDate() + 7));
  }
  return weeks;
};