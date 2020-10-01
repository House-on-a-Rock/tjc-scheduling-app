import express, { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import jwt, { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import {
    addMinutes,
    createToken,
    creatResetToken,
    hashPassword,
    sendGenericEmail,
    sendVerEmail,
} from '../utilities/helperFunctions';
import db from '../index';
// to destructure db into { Token, User}, cannot use default exports
const router = express.Router();

module.exports = router;

router.get(
    '/confirmation',
    async ({ query }: Request, res: Response, next: NextFunction) => {
        try {
            const { expiresIn, token, userId } = await db.Token.findOne({
                where: { token: query.token.toString() },
                attributes: ['userId', 'token', 'expiresIn'],
            });
            const [current, expiration] = [Date.now(), new Date(expiresIn).getTime()];
            const determineMessageStatus: () => [string, number] = () => {
                switch (true) {
                    case !token:
                        return ['Token not found', 401];
                    case expiration <= current:
                        return ['Token expired', 401];
                    default:
                        return ['The account has been verified. Please log in.', 201];
                }
            };
            const [message, status] = determineMessageStatus();

            if (status === 201) {
                const user = await db.User.findOne({
                    where: { id: userId },
                    attributes: ['isVerified'],
                });
                user.update({
                    id: userId,
                    isVerified: true,
                });
            }
            return res.status(status).send({ message });
        } catch (err) {
            res.status(503).send({ message: 'Server error, try again later' });
            console.log('asldfasd1283!@#', err);
            return next(err);
        }
    },
);

router.post('/resendConfirm', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { headers } = req;
        const { email } = req.body;
        const { id: userId } = await db.User.findOne({
            where: { email },
            attributes: ['id'],
        });
        const userToken = await db.Token.findOne({
            where: { userId },
            attributes: ['id', 'token', 'expiresIn'],
        });
        const newToken = crypto.randomBytes(16).toString('hex');
        // update token entry with new token and extended expire time
        userToken.update({
            id: userToken.id,
            token: newToken,
            expiresIn: Date.now() + 30 * 60 * 1000,
        });
        const [message, status] = sendVerEmail(email, headers, newToken, 'confirmation');
        return res.status(status).send({ message });
    } catch (err) {
        res.status(503).send({ message: 'Server error, try again later' });
        return next(err);
    }
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email: loginEmail, password: loginPassword } = req.body;
        const user = await db.User.findOne({
            where: { email: loginEmail },
            attributes: [
                'id',
                'firstName',
                'lastName',
                'email',
                'password',
                'salt',
                'loginTimeout',
                'loginAttempts',
                'isVerified',
            ],
        });
        const {
            password,
            salt,
            loginTimeout,
            loginAttempts,
            id,
            isVerified,
            firstName,
            lastName,
            email,
        } = user;
        const hashedLoginPassword = hashPassword(loginPassword, salt);
        const determineMessageStatus: () => [string, number] = () => {
            const currentTime = new Date();
            switch (true) {
                case !user:
                    return ['Invalid Username or Password', 401];
                case loginTimeout && loginTimeout.getTime() < currentTime.getTime():
                    return ['Too many login attempts', 400];
                case hashedLoginPassword !== password:
                    return ['Invalid Username or Password', 401];
                case !isVerified:
                    return ['Please verify your email', 403];
                default:
                    return ['success', 200];
            }
        };
        const [message, status] = determineMessageStatus();
        if (hashedLoginPassword !== password) {
            const updatedAttempts =
                loginAttempts === 3
                    ? {
                          id,
                          loginAttempts: 0,
                          loginTimeout: addMinutes(new Date(), 5),
                      }
                    : { id, loginAttempts: loginAttempts + 1 };
            user.update(updatedAttempts);
        }

        if (status > 299) return res.status(status).send({ message });

        // if login is successful, reset login attempt information
        user.update({ id, loginAttempts: 0, loginTimeout: null });
        const token = createToken('reg', id, 60);
        return res.status(status).json({
            user_id: id,
            firstName,
            lastName,
            email,
            access_token: token,
        });
    } catch (err) {
        // next(err);
        return res.status(503).send({ message: 'Server error, try again later' });
    }
});

router.post(
    '/confirmPassword',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password: loginPassword } = req.body;
            const { salt, password } = await db.User.findOne({
                where: { email },
                attributes: ['salt', 'password'],
            });

            const checkedHash = hashPassword(loginPassword, salt);
            const [message, status, verify] =
                checkedHash !== password
                    ? ['Invalid credentials', 401, false]
                    : ['Password confirmed', 200, true];
            return res.status(status).send({ message, verify });
        } catch (err) {
            res.status(503).send({ message: 'Server error, try again later' });
            return next(err);
        }
    },
);

// router.post(
//     '/changePassword',
//     async (req: Request, res: Response, next: NextFunction) => {
//         try {
//             const { authorization } = req.headers;
//             const { userId, email } = req.body;
//             jwt.verify(authorization, cert);
//             const decodedToken = jwt.decode(authorization, { json: true });
//             const requestId = decodedToken.sub.split('|')[1];
//             if (requestId === userId) {
//                 const options = {
//                     method: 'POST',
//                     uri: `http://${process.env.SECRET_IP}/api/authentication/confirmPassword`,
//                     body: {
//                         email,
//                         password: req.body.oldPass,
//                     },
//                     json: true,
//                 };
//                 const verifyOldPassword = await request(options);

//                 console.log(verifyOldPassword);
//                 const user = await db.User.findOne({
//                     where: { email },
//                     attributes: ['id', 'password', 'salt'],
//                 });

//                 if (verifyOldPassword.verify) {
//                     user.update({
//                         id: user.id,
//                         password: req.body.password,
//                     });

//                     res.status(200).send({
//                         message: 'Password change success.',
//                     });
//                 }
//             }
//         } catch (err) {
//             if (err instanceof TokenExpiredError || err instanceof JsonWebTokenError) {
//                 res.status(401).send({ message: 'Unauthorized' });
//             } else {
//                 res.status(503).send({ message: 'Server error, try again later' });
//             }
//             next(err);
//         }
//     },
// );

router.post(
    '/sendResetEmail',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.body;
            const user = await db.User.findOne({
                where: { email },
                attributes: ['id', 'password', 'isVerified'],
            });
            const { isVerified, id, password } = user;

            if (user && isVerified) {
                const token = creatResetToken(id, 15, password);
                const [tokenHeader, tokenPayload, tokenSignature] = token.split('.');
                sendGenericEmail(
                    email,
                    `http://localhost:8080/api/authentication/checkResetToken?header=${tokenHeader}&payload=${tokenPayload}&signature=${tokenSignature}`,
                );
                return res.status(200).send({
                    message: 'Recovery token created',
                    email,
                    token: token,
                });
            }
            return res.status(200);
        } catch (err) {
            next(err);
            return res.status(503).send({ message: 'Server error, try again later' });
        }
    },
);

router.get(
    '/checkResetToken',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { header, payload, signature } = req.query;
            const decodedToken = jwt.decode(`${header}.${payload}.${signature}`, {
                json: true,
            });
            const requestId = decodedToken.sub.split('|')[1];
            const { password } = await db.User.findOne({
                where: { id: parseInt(requestId, 10) },
                attributes: ['id', 'email', 'password', 'isVerified'],
            });
            jwt.verify(`${header}.${payload}.${signature}`, password);
            // res.status(200).send({ message: 'token valid' }); // replace with res.redirect

            // These commented out lines is what you need. I just dunno how the jwt works, but this is how it should work.
            // (jwt === verified) ?
            return res.redirect(
                `http://localhost:8081/auth/resetPassword?token=${header}.${payload}.${signature}`,
            );
            // : res.redirect(`http://localhost:8081/auth/expiredAccess?message='TokenExpired'`)
            // also if you could change the way that "Token Expired" string is sent, I think you have to
            // const querystring = require('querystring');
            // const message = querystring.stringify({message:"TokenExpired", status:401})
            // : res.redirect(`http://localhost:8081/auth/expiredAccess?message=${message}`)
        } catch (err) {
            if (err instanceof TokenExpiredError) {
                return res.redirect(
                    `http://localhost:8081/auth/expiredAccess?message=TokenExpired&status=401`,
                );
            }
            if (err instanceof JsonWebTokenError) {
                return res.status(400).send({ message: 'No token found' });
            }
            next(err);
            return res.status(503).send({ message: 'Server error, try again later' });
        }
    },
);

router.post('/resetPassword', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authorization } = req.headers;
        const { password: newPassword, email: queryEmail } = req.body;
        const requestId = jwt.decode(authorization, { json: true }).sub.split('|')[1];
        const user = await db.User.findOne({
            where: { id: parseInt(requestId, 10) },
            attributes: ['id', 'email', 'password', 'isVerified'],
        });
        const { email: userEmail, password, isVerified, id } = user;
        jwt.verify(authorization, password);

        const [message, status] =
            // eslint-disable-next-line no-nested-ternary
            userEmail !== queryEmail
                ? ['Invalid Request', 401]
                : isVerified
                ? ['Password change success.', 201]
                : ['User does not exist or is not verified', 401];

        if (status === 201)
            user.update({
                id,
                password: newPassword,
                token: null,
            });
        return res.status(status).send({ message });
    } catch (err) {
        next(err);
        return res.status(503).send({ message: 'Server error, try again later' });
    }
});
