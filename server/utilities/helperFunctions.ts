import nodemailer from 'nodemailer';
import crypto from 'crypto';
import jwt, { Algorithm, TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import fs from 'fs';
import { DateTime } from 'luxon';
import { RoleAttributes } from 'shared/SequelizeTypings/models';

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

export function createToken(tokenType, userId, expiresInMinutes, roleIds: (number | RoleAttributes)[] = []) {
    console.log('Creating token');
    let mappedRoleIds = '';
    roleIds.forEach((roleId, id) => {
        if (id === 0) mappedRoleIds += roleId.toString();
        else mappedRoleIds += `|${roleId.toString()}`;
    });
    const token = jwt.sign(
        {
            iss: process.env.AUDIENCE,
            sub: `tjc-scheduling|${userId}`,
            exp: Math.floor(Date.now() / 1000) + expiresInMinutes * 60 * 60,
            type: tokenType,
            roleIds: mappedRoleIds,
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
    return crypto.createHash(process.env.SECRET_HASH).update(password).update(salt).digest('hex');
}
export function makeMyNotificationMessage(notification: string, type: string, firstName: string): string {
    switch (notification) {
        case 'accepted':
            return `Your requested has been accepted by ${firstName}`;
        case 'approved':
            return `Your request to switch with ${firstName} has been approved`;
        case 'cancelled':
            return `Your request to switch has been cancelled`;
        case 'created':
            return type === 'requestOne' ? `Request sent to ${firstName}` : `Request sent to all local church members`;
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
        type === 'order' ? target.order < arr[lastIdx].order : !isTimeBefore(arr[lastIdx].time, target.time);
    if (!condition) {
        arr.splice(lastIdx + 1, 0, target);
        return arr;
    }
    return correctOrder(arr, lastIdx - 1, target, type);
}

const dayIndex = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
};

const zeroPaddingDates = (monthIdx: number, dayIdx: number): string => {
    let month = (monthIdx + 1).toString();
    let day = dayIdx.toString();

    month = month.length > 1 ? month : `0${month}`;
    day = day.length > 1 ? day : `0${day}`;

    return `${month}/${day}`;
};

export const contrivedDate = (date: string | Date) => {
    const jsDate = new Date(date);
    const monthIdx = jsDate.getMonth();
    const dayIdx = jsDate.getDate();
    return zeroPaddingDates(monthIdx, dayIdx);
};

const readableDate = (unreadableDate: Date) =>
    `${unreadableDate.getMonth() + 1}/${unreadableDate.getDate()}/${unreadableDate.getFullYear()}`;

const incrementDay = (date: Date) => new Date(date.setDate(date.getDate() + 1));

function determineStartDate(startDate: string, day: number) {
    let current = incrementDay(new Date(startDate));
    while (current.getDay() !== day) current = incrementDay(current);
    return current;
}

export function columnizedDates(everyRepeatingDay: string[]) {
    return everyRepeatingDay.map((date: string) => {
        const jsDate = new Date(date);
        const monthIdx = jsDate.getMonth();
        const dayIdx = jsDate.getDate();
        return {
            Header: zeroPaddingDates(monthIdx, dayIdx),
            accessor: zeroPaddingDates(monthIdx, dayIdx),
        };
    });
}

export function everyRepeatingDayBetweenTwoDates(startDate: string, endDate: string, day: number) {
    const everyRepeatingDay = [];
    let start = new Date(startDate);

    if (start.getDay() !== day) start = determineStartDate(startDate, day);

    let current = new Date(start);
    const end = new Date(endDate);

    while (current <= end) {
        everyRepeatingDay.push(readableDate(current));
        current = new Date(current.setDate(current.getDate() + 7));
    }
    return everyRepeatingDay;
}

export function createColumns(start: any, end: any, day: any) {
    return [
        {
            Header: 'Time',
            accessor: 'time',
        },
        {
            Header: 'Duty',
            accessor: 'duty',
        },
        ...columnizedDates(everyRepeatingDayBetweenTwoDates(start, end, day)),
    ];
}
