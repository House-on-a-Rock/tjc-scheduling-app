/* eslint-disable max-lines */
import crypto from 'crypto';
import fs from 'fs';

import jwt, { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { DateTime } from 'luxon';
import nodemailer from 'nodemailer';

const privateKey = fs.readFileSync('tjcschedule.pem');
let cert;
fs.readFile('tjcschedule_pub.pem', (err, data) => {
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
      to: 'shaun.tung@gmail.com',
      subject: 'Password Reset',
      text: `Hello,\n\n Please reset your password to your account by clicking the link: \n${link}`,
    };
    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.log(err);
        return false;
      }
      return true;
    });
  } catch (err) {
    console.error(err);
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

export function createUserToken({ user, tokenType = '', expirationMin, teams = [] }) {
  console.log('Creating token');

  let access = '';

  if (user.isAdmin) access = 'ADMIN';
  else if (teams.length) {
    access = 'TEAM_LEAD';
    teams.forEach(({ role }) => {
      const { name } = role;
      access = `${access}-${name.toUpperCase().replace(' ', '_').replace('-', '_')}`;
    });
  } else access = 'USER';

  const userInfo = JSON.stringify({
    id: user.id,
    churchId: user.church.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    access,
  });
  const token = jwt.sign(
    {
      iss: process.env.AUDIENCE,
      sub: `tjc-scheduling|${userInfo}`,
      exp: Math.floor(Date.now() / 1000) + expirationMin * 60 * 60,
      type: tokenType,
      access,
    },
    { key: privateKey, passphrase: process.env.PRIVATEKEY_PASS ?? '' },
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

// unused
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

// adds zeroes in front of single digit dates  5/8 --> 05/08
function zeroPaddingDates(date) {
  let month = (date.getMonth() + 1).toString();
  let day = date.getDate().toString();

  month = month.length > 1 ? month : `0${month}`;
  day = day.length > 1 ? day : `0${day}`;

  return `${month}/${day}`;
}

// turns {start, end} into '05/25 - 06/30' format
export function formatDates(weekRange) {
  const r = weekRange.map((week) => {
    const start = zeroPaddingDates(week.start);
    const end = zeroPaddingDates(week.end);

    const returnstring = start === end ? `${start}` : `${start} - ${end}`;
    return { Header: returnstring };
  });
  return r;
}

// creates array of weekly {start, end} dates for a given range of dates
export function weeksRange(startDate, endDate) {
  const weekArray = [];
  const currentDate = new Date(startDate);
  const currentObj = { start: startDate };

  // eslint-disable-next-line no-unmodified-loop-condition
  while (currentDate <= endDate) {
    if (currentDate.getDay() === 0) {
      currentObj.start = new Date(currentDate);
    } else if (currentDate.getDay() === 6) {
      currentObj.end = new Date(currentDate);
      weekArray.push({ ...currentObj });
    } else if (areDatesEqual(currentDate, endDate)) {
      currentObj.end = new Date(currentDate);
      weekArray.push({ ...currentObj });
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return weekArray;
}

export function areDatesEqual(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function containsDate(range, date) {
  const startDate = new Date(range.start);
  const endDate = new Date(range.end);
  const testDate = removeTimezoneFromDate(date);
  return testDate - startDate >= 0 && endDate - testDate >= 0;
}

export function removeTimezoneFromDate(date) {
  return new Date(replaceDashWithSlash(date));
}

export function replaceDashWithSlash(str) {
  const regex = /-/gm;
  return str.replace(regex, '/');
}

export function isSameWeek(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const weekStart = new Date(date1);
  const sevenDaysToMilliseconds = 7 * 24 * 60 * 60 * 1000;

  weekStart.setDate(d1.getDate() - d1.getDay());
  return d2 - weekStart < sevenDaysToMilliseconds && d2 - weekStart >= 0;
}
