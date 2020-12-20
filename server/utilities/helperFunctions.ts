import nodemailer from 'nodemailer';
import crypto from 'crypto';
import jwt, { Algorithm, TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import fs from 'fs';
import { DateTime } from 'luxon';
import {
  RoleAttributes,
  ServiceInstance,
  TaskInstance,
} from 'shared/SequelizeTypings/models';
import db from '../index';

const privateKey = fs.readFileSync('tjcschedule.pem');
let cert;
fs.readFile('tjcschedule_pub.pem', function read(err, data) {
  if (err) throw err;
  cert = data;
});

export function certify(req, res, next) {
  try {
    const { authorization } = req.headers;
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

export function sendVerEmail(username, headers, token, api): [string, number] {
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
      text: `Hello,\n\n Please verify your account by clicking the link: \nhttp://${headers.host}/api/authentication/${api}?token=${token}`,
    };
    transporter.sendMail(mailOptions, function (err) {
      return !err ? console.log('success') : console.log(err.message);
    });
    return [message, 201];
  } catch (err) {
    console.log(err);
    return ['error', 401];
  }
}

export function addMinutes(date: Date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

export function createToken(
  tokenType,
  userId,
  expiresInMinutes,
  isAdmin = false,
  roleIds: (number | RoleAttributes)[] = [],
) {
  console.log('Creating token');
  let mappedRoleIds = '';
  roleIds.forEach((roleId, id) => {
    if (id === 0) mappedRoleIds += roleId.toString();
    else mappedRoleIds += `|${roleId.toString()}`;
  });
  if (isAdmin) mappedRoleIds += '0';
  const token = jwt.sign(
    {
      iss: process.env.AUDIENCE,
      sub: `tjc-scheduling|${userId}`,
      exp: Math.floor(Date.now() / 1000) + expiresInMinutes * 60 * 60,
      type: tokenType,
      access: mappedRoleIds,
    },
    {
      key: privateKey,
      passphrase: process.env.PRIVATEKEY_PASS,
    },
    { algorithm: process.env.JWT_ALGORITHM as Algorithm },
  );

  return token;
}
export function createResetToken(userId, expiresInMinutes, secret) {
  console.log('Creating token');
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
export function validateEmail(email: string) {
  return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

export function setDate(date: string, time: string, timeZone: string) {
  return DateTime.fromISO(`${date}T${time}`, { zone: timeZone });
}

export function hashPassword(password: string, salt: string) {
  return crypto
    .createHash(process.env.SECRET_HASH)
    .update(password)
    .update(salt)
    .digest('hex');
}
export function makeMyNotificationMessage(
  notification: string,
  type: string,
  firstName: string,
): string {
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

export function determineLoginId(auth) {
  const decodedToken = jwt.decode(auth, { json: true });
  return parseInt(decodedToken.sub.split('|')[1], 10);
}

export function timeToMilliSeconds(time: string) {
  const [hourMin, period] = time.split(' ');
  const [hour, min] = hourMin.split(':');
  const convertedHour = hour === '12' ? 0 : 3600000 * parseInt(hour, 10);
  const convertedMin = 60000 * parseInt(min, 10);
  const convertedPeriod = period === 'AM' ? 0 : 43200000;

  return convertedHour + convertedMin + convertedPeriod;
}

export function isInTime(target: string, start: string, end: string): boolean {
  const targetTime = timeToMilliSeconds(target);
  const startTime = timeToMilliSeconds(start);
  const endTime = timeToMilliSeconds(end);
  return startTime <= targetTime && targetTime <= endTime;
}

export function isTimeBefore(comparing: string, target: string): boolean {
  const targetTime = timeToMilliSeconds(target);
  const comparingTime = timeToMilliSeconds(comparing);
  return comparingTime < targetTime;
}

// Recursively checks if the order is correct by checking from last element to first.
export function correctOrder(arr, lastIdx, target, type) {
  if (lastIdx === -1) {
    arr.unshift(target);
    return arr;
  }
  const condition =
    type === 'order'
      ? target.order < arr[lastIdx].order
      : !isTimeBefore(arr[lastIdx].time, target.time);
  if (!condition) {
    arr.splice(lastIdx + 1, 0, target);
    return arr;
  }
  return correctOrder(arr, lastIdx - 1, target, type);
}

// adds 0 in front of single-digit months
const zeroPaddingDates = (date: Date): string => {
  let month = (date.getMonth() + 1).toString();
  let day = date.getDate().toString();

  month = month.length > 1 ? month : `0${month}`;
  day = day.length > 1 ? day : `0${day}`;

  return `${month}/${day}`;
};

export const matchKey = (date: Date) => {
  let start = new Date(date);
  start.setDate(start.getDate() - start.getDay()); //sets start to sunday
  let end = new Date(start);
  end.setDate(start.getDate() + 6);
  return `${zeroPaddingDates(start)}-${zeroPaddingDates(end)}`;
};

export function columnizedDates(everyRepeatingDay: Date[]) {
  return everyRepeatingDay.map((date: Date) => {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(startDate.getDate() + 6);

    return {
      Header: `${zeroPaddingDates(startDate)}-${zeroPaddingDates(endDate)}`,
      accessor: `${zeroPaddingDates(startDate)}-${zeroPaddingDates(endDate)}`,
    };
  });
}

export function determineWeeks(startDate: Date, endDate: Date) {
  const weeks = [];
  let start = new Date(startDate);
  start.setDate(start.getDate() - start.getDay()); //sets start to sunday
  let end = new Date(endDate);
  end.setDate(end.getDate() + (6 - end.getDay()));

  let current = new Date(start);

  while (current <= end) {
    weeks.push(current);
    current = new Date(current.setDate(current.getDate() + 7));
  }
  return weeks;
}

export function createColumns(start: Date, end: Date) {
  return [
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

export async function populateServiceData({
  name,
  day,
  id,
}: ServiceInstance): Promise<any> {
  const events = await db.Event.findAll({
    where: { serviceId: id },
    order: [['order', 'ASC']],
  }); //returns events in ascending order
  // for each event, retrieve role data and associated task data
  const eventData = await Promise.all(
    events.map(async (event) => {
      const { time, title, roleId, displayTime, id: eventId } = event;
      const role = await retrieveEventRole(roleId);
      const tasks = await retrieveTaskData(eventId, role);
      const timeColumn = timeDisplay(time, displayTime);
      const dutyColumn = dutyDisplay(title, role);
      return {
        time,
        title,
        roleId,
        displayTime,
        eventId,
        cells: [timeColumn, dutyColumn, ...tasks],
      };
    }),
  );
  return { name: name, day: day, eventData, serviceId: id };
}

function timeDisplay(time, displayTime) {
  return { display: displayTime ? time : '', time, displayTime };
}

function dutyDisplay(title, role) {
  return { display: title, role: role };
}

async function retrieveEventRole(roleId) {
  return db.Role.findOne({
    where: { id: roleId },
    attributes: ['id', 'name'],
  });
}

async function retrieveTaskData(eventId, role) {
  const tasks = await db.Task.findAll({
    where: { eventId },
    attributes: ['id', 'date', 'userId'],
    include: [
      {
        model: db.User,
        as: 'user',
        attributes: ['firstName', 'lastName'],
      },
    ],
    order: [['date', 'ASC']],
  });
  const organizedTasks = tasks.map((task: any) => {
    return {
      taskId: task.id,
      date: task.date,
      firstName: task.user.firstName,
      lastName: task.user.lastName,
      userId: task.userId,
      role: role,
    };
  });
  return organizedTasks;
}
