import nodemailer from 'nodemailer';
import jwt, { Algorithm } from 'jsonwebtoken';
import fs from 'fs';
import { privateEncrypt } from 'crypto';

const privateKey = fs.readFileSync('tjcschedule.pem');

const funcs = {
    sendGenericEmail(username, link) {
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
    },

    sendVerEmail(username, req, token, api) {
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
                text: `Hello,\n\n Please verify your account by clicking the link: \nhttp://${req.headers.host}/api/authentication/${api}?token=${token}`,
            };
            transporter.sendMail(mailOptions, function (err) {
                if (err) {
                    console.log(err.message);
                }
                return true;
            });
        } catch (err) {
            console.log(err);
        }
    },

    addMinutes(date: Date, minutes) {
        return new Date(date.getTime() + minutes * 60000);
    },

    createToken(tokenType, userId, expiresInMinutes) {
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
    },
    creatResetToken(userId, expiresInMinutes, secret) {
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
    },
    validateEmail(email: string) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return true;
        }
        return false;
    },
};
export default funcs;
