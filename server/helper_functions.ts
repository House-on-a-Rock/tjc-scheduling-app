import nodemailer from 'nodemailer';

const funcs = {
    sendVerEmail(username, req, res, token, api) {
        console.log('Sending email..');
        let message;
        if (api == 'confirmation') {
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
                return res.status(500).send({ message: err.message });
            }
            res.status(200).send({
                message: message,
            });
            return true;
        });
    },

    addMinutes(date: Date, minutes) {
        return new Date(date.getTime() + minutes * 60000);
    },
};
export default funcs;
