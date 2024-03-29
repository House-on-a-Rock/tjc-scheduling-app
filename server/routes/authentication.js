import crypto from 'crypto';

import express from 'express';
import { jwt, TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';

import db from '../index';
import {
  addMinutes,
  createUserToken,
  createResetToken,
  hashPassword,
  sendGenericEmail,
  sendVerEmail,
  certify,
} from '../utilities/helperFunctions';

// to destructure db into { Token, User}, cannot use default exports
const router = express.Router();

// router.get('/', function (req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/confirmation', async (req, res, next) => {
  try {
    const { expiresIn, token, userId } = await db.Token.findOne({
      where: { token: req.query.token?.toString() },
      attributes: ['userId', 'token', 'expiresIn'],
    });
    const [current, expiration] = [Date.now(), new Date(expiresIn).getTime()];
    const determineMessageStatus = () => {
      switch (true) {
        case !token:
          return ['Token not found', 401];
        case expiration <= current:
          return ['Token expired', 401];
        default:
          return ['The account has been verified. Please log in.', 200];
      }
    };
    const [message, status] = determineMessageStatus();

    if (status === 200) {
      const user = await db.User.findOne({
        where: { id: userId },
        attributes: ['isVerified'],
      });
      await user.update({ id: userId, isVerified: true });
    }
    return res.status(status).send({ message });
  } catch (err) {
    next(err);
    return res.status(503).send({ message: 'Server error, try again later' });
  }
});

router.post('/resendConfirm', async (req, res, next) => {
  try {
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
    const [message, status] = sendVerEmail(email, req, newToken, 'confirmation');
    return res.status(status).send({ message });
  } catch (err) {
    next(err);
    return res.status(503).send({ message: 'Server error, try again later' });
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const user = await db.User.findOne({
      where: { email: req.body.email },
      include: [
        {
          model: db.Church,
          as: 'church',
          attributes: ['id'],
        },
      ],
    });

    const userRoles = await db.UserRole.findAll({
      where: { userId: user.Id },
    });
    const roleIds = userRoles
      .filter((userRole) => userRole.teamLead)
      .map((userRole) => userRole.roleId);

    const hashedLoginPassword = hashPassword(req.body.password, user.salt);
    const determineMessageStatus = () => {
      const currentTime = new Date();
      switch (true) {
        case !user:
          return ['Invalid Username or Password', 401];
        case user.loginTimeout?.getTime() < currentTime.getTime():
          return ['Too many login attempts', 400];
        case hashedLoginPassword !== user.password:
          return ['Invalid Username or Password', 401];
        case !user.isVerified:
          return ['Please verify your email', 403];
        case roleIds.length || !user.isAdmin:
          return ['You are not permitted to access this site', 404];
        default:
          return ['success', 200];
      }
    };
    const [message, status] = determineMessageStatus();

    if (status > 299) return res.status(status).send({ message });
    if (hashedLoginPassword !== user.password) {
      const updatedAttempts =
        user.loginAttempts >= 3
          ? {
              id: user.id,
              loginAttempts: 0,
              loginTimeout: addMinutes(new Date(), 5),
            }
          : { id: user.id, loginAttempts: user.loginAttempts + 1 };
      await user.update(updatedAttempts);
    }
    await user.update({ id: user.id, loginAttempts: 0, loginTimeout: null });
    const token = createUserToken({ user, expirationMin: 600, roleIds });

    return res.status(200).json({ token });
  } catch (err) {
    next(err);
    return res.status(503).send({ message: 'Server error, try again later' });
  }
});

// router.post('/login', async (req, res, next) => {
//   try {
//     const { email: loginEmail, password: loginPassword } = req.body;
//     const user = await db.User.findOne({
//       where: { email: loginEmail },
//       include: [
//         {
//           model: db.Church,
//           as: 'church',
//           attributes: ['id'],
//         },
//       ],
//     });
//     const {
//       password,
//       salt,
//       loginTimeout,
//       loginAttempts,
//       id,
//       isVerified,
//       firstName,
//       lastName,
//       email,
//       church,
//     } = user;
//     const hashedLoginPassword = hashPassword(loginPassword, salt);
//     const determineMessageStatus = () => {
//       const currentTime = new Date();
//       switch (true) {
//         case !user:
//           return ['Invalid Username or Password', 401];
//         case loginTimeout && loginTimeout.getTime() < currentTime.getTime():
//           return ['Too many login attempts', 400];
//         case hashedLoginPassword !== password:
//           return ['Invalid Username or Password', 401];
//         case !isVerified:
//           return ['Please verify your email', 403];
//         default:
//           return ['success', 200];
//       }
//     };
//     const [message, status] = determineMessageStatus();

//     if (status > 299) return res.status(status).send({ message });
//     if (hashedLoginPassword !== password) {
//       const updatedAttempts =
//         loginAttempts >= 3
//           ? {
//               id,
//               loginAttempts: 0,
//               loginTimeout: addMinutes(new Date(), 5),
//             }
//           : { id, loginAttempts: loginAttempts + 1 };
//       await user.update(updatedAttempts);
//     }

//     await user.update({ id, loginAttempts: 0, loginTimeout: null });
//     const token = createUserToken('reg', id, church.id, 600);
//     return res
//       .status(status)
//       .json({ user_id: id, firstName, lastName, email, access_token: token });
//   } catch (err) {
//     next(err);
//     return res.status(503).send({ message: 'Server error, try again later' });
//   }
// });

router.post('/confirmPassword', async (req, res, next) => {
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
    next(err);
    return res.status(503).send({ message: 'Server error, try again later' });
  }
});

// router.post('/changePassword', async (req, res, next) => {
//     try {
//         const { authorization } = req.headers;
//         const { userId, email } = req.body;
//         const decodedToken = jwt.decode(authorization, { json: true });
//         const requestId = decodedToken.sub.split('|')[1];
//         if (requestId === userId) {
//             const options = {
//                 method: 'POST',
//                 uri: `http://${process.env.SECRET_IP}/api/authentication/confirmPassword`,
//                 body: {
//                     email,
//                     password: req.body.oldPass,
//                 },
//                 json: true,
//             };
//             const verifyOldPassword = await request(options);
//             const user = await db.User.findOne({
//                 where: { email },
//                 attributes: ['id', 'password', 'salt'],
//             });

//             if (verifyOldPassword.verify) {
//                 user.update({
//                     id: user.id,
//                     password: req.body.password,
//                 });

//                 res.status(200).send({
//                     message: 'Password change success.',
//                 });
//             }
//         }
//     } catch (err) {
//         next(err);
//         return res.status(503).send({ message: 'Server error, try again later' });
//     }
// });

router.post('/sendResetEmail', async (req, res, next) => {
  // TODO Error: Invalid login: 535 Authentication failed: Basic authentication is not allowed with 2FA enabled
  try {
    const { email } = req.body;
    const user = await db.User.findOne({
      where: { email },
      attributes: ['id', 'password', 'isVerified'],
    });
    if (!user) return res.status(404).send({ message: 'User is not found' });
    const { isVerified, id, password } = user;

    if (user && isVerified) {
      const token = createResetToken(id, 15, password);
      const [tokenHeader, tokenPayload, tokenSignature] = token.split('.');
      sendGenericEmail(
        email,
        `http://localhost:8080/api/authentication/checkResetToken?header=${tokenHeader}&payload=${tokenPayload}&signature=${tokenSignature}`,
      );
      return res.status(201).send({ message: 'Recovery token created' });
    } else
      return res
        .status(404)
        .send({ message: 'User has not been verified. Please verify your email.' });
  } catch (err) {
    next(err);
    return res.status(503).send({ message: 'Server error, try again later' });
  }
});

router.get('/checkResetToken', async (req, res, next) => {
  try {
    const { header, payload, signature } = req.query;
    const decodedToken = jwt.decode(`${header}.${payload}.${signature}`, {
      json: true,
    });
    const requestId = decodedToken?.sub.split('|')[1];
    const { password } = await db.User.findOne({
      where: { id: parseInt(requestId, 10) },
      attributes: ['id', 'email', 'password', 'isVerified'],
    });
    jwt.verify(`${header}.${payload}.${signature}`, password);
    // res.status(200).send({ message: 'token valid' }); // replace with res.redirect

    // These commented out lines is what you need. I just dunno how the jwt works, but this is how it should work.
    // (jwt === verified) ?
    return res.redirect(
      `http://localhost:8080/auth/resetPassword?token=${header}.${payload}.${signature}`,
    );
    // : res.redirect(`http://localhost:8081/auth/expiredAccess?message='TokenExpired'`)
    // also if you could change the way that "Token Expired" string is sent, I think you have to
    // const querystring = require('querystring');
    // const message = querystring.stringify({message:"TokenExpired", status:401})
    // : res.redirect(`http://localhost:8081/auth/expiredAccess?message=${message}`)
  } catch (err) {
    if (err instanceof TokenExpiredError)
      return res.redirect(
        `http://localhost:8081/auth/expiredAccess?message=TokenExpired&status=401`,
      );

    if (err instanceof JsonWebTokenError)
      return res.status(400).send({ message: 'No token found' });
    next(err);
    return res.status(503).send({ message: 'Server error, try again later' });
  }
});

router.post('/resetPassword', certify, async (req, res, next) => {
  try {
    const { authorization = '' } = req.headers;
    const { password: newPassword, email: queryEmail } = req.body;
    const requestId = jwt.decode(authorization, { json: true })?.sub.split('|')[1];
    const user = await db.User.findOne({
      where: { id: parseInt(requestId, 10) },
      attributes: ['id', 'email', 'password', 'isVerified'],
    });
    const { email: userEmail, password, isVerified, id } = user;
    jwt.verify(authorization, password);

    const [message, status] =
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

export default router;
