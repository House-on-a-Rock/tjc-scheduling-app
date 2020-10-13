import nodemailer from 'nodemailer';
import crypto from 'crypto';
import jwt, { Algorithm, TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import fs from 'fs';
import { DateTime } from 'luxon';

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
        let message;
        if (api === 'confirmation') {
            message = `A verification email has been sent to ${username}.`;
        } else {
            message = `A password recovery email has been sent to ${username}.`;
        }
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
            subject: 'Account Verification Token',
            text: `Hello,\n\n Please verify your account by clicking the link: \nhttp://${headers.host}/api/authentication/${api}?token=${token}`,
        };
        transporter.sendMail(mailOptions, function (err) {
            return err ? console.log(err.message) : console.log('success');
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

export function createToken(tokenType, userId, expiresInMinutes) {
    console.log('Creating token');
    const token = jwt.sign(
        {
            iss: process.env.AUDIENCE,
            sub: `tjc-scheduling|${userId}`,
            exp: Math.floor(Date.now() / 1000) + expiresInMinutes * 60,
            type: tokenType,
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
export function makeMyNotificationMessage(notification: string, type: string, firstName: string) {
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
