import crypto from 'crypto';

import express, { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import Sequelize from 'sequelize';

import db from '../index';
import { certify, sendVerEmail, validateEmail } from '../utilities/helperFunctions';

const router = express.Router();
const { Op } = Sequelize;

router.get('/users', certify, async (req, res, next) => {
  try {
    const { roleId, churchId } = req.query;
    const searchArray = [];
    if (churchId) searchArray.push({ churchId });
    if (roleId) {
      const userRoles = await db.UserRole.findAll({
        where: { roleId: roleId.toString() },
        attributes: ['userId'],
      });
      if (userRoles.length === 0)
        return res.status(404).send({ message: 'No users found with that role id' });
      const userIds = userRoles.map((userRole) => userRole.userId);
      searchArray.push({ id: userIds });
    }
    const searchParams = { [Op.and]: searchArray };
    const users = await db.User.findAll({
      where: searchParams,
      attributes: [
        ['id', 'userId'],
        'firstName',
        'lastName',
        'email',
        'churchId',
        'disabled',
      ],
      include: [
        {
          model: db.Church,
          as: 'church',
          attributes: ['name'],
        },
      ],
    });

    return users.length
      ? res.status(200).json(users)
      : res.status(404).send({ message: 'Users not found' });
  } catch (err) {
    next(err);
    return res.status(503).send({ message: 'Server error, try again later' });
  }
});

router.get('/user/:userId', certify, async (req, res, next) => {
  try {
    const parsedId = req.params.userId.toString();
    const user = await db.User.findOne({
      where: {
        id: parsedId,
      },
      attributes: ['firstName', 'lastName', 'email', 'id', 'churchId', 'expoPushToken'],
      include: [
        {
          model: db.Church,
          as: 'church',
          attributes: ['name'],
        },
      ],
    });
    return user
      ? res.status(200).json(user)
      : res.status(404).send({ message: 'User not found' });
  } catch (err) {
    next(err);
    return res.status(503).send({ message: 'Server error, try again later' });
  }
});

router.post('/user', certify, async (req, res, next) => {
  try {
    const { email, firstName, lastName, churchId } = req.body;
    const token = crypto.randomBytes(16).toString('hex');
    const userExists = await db.User.findOne({
      where: { email },
      attributes: ['id', 'email'],
    });
    const { id } =
      !userExists &&
      (await db.User.create({
        firstName,
        lastName,
        email,
        churchId,
        isVerified: false,
        disabled: false,
      }));
    const addedUser =
      id &&
      (await db.User.findOne({
        where: { id },
        attributes: ['id', 'firstName', 'lastName', 'email', 'disabled'],
        include: [
          {
            model: db.Church,
            as: 'church',
            attributes: ['name'],
          },
        ],
      }));

    if (addedUser) await db.Token.create({ userId: addedUser.id, token });

    const determineMessageStatus = () => {
      switch (true) {
        case !validateEmail(email):
          return ['Invalid email', 406];
        case !userExists:
          sendVerEmail(email, req, token, 'confirmation');
          return ['', 200];
        case !!userExists:
          return ['User already exists', 409];
        default:
          return ['', 400];
      }
    };
    const [message, status] = determineMessageStatus();
    return status === 200
      ? res.status(status).json(addedUser)
      : res.status(status).send({ message });
  } catch (err) {
    next(err);
    return res.status(503).send({ message: 'Server error, try again later' });
  }
});

router.delete('/user/:userId', certify, async (req, res, next) => {
  try {
    const user = await db.User.findOne({
      where: { id: req.params.userId },
      attributes: ['id'],
    });
    const [message, status] = user ? ['', 200] : ['User not found', 404];
    if (status === 200) await user.destroy();
    return res.status(status).send({ message });
  } catch (err) {
    next(err);
    return res.status(503).send({ message: 'Server error, try again later' });
  }
});

// updates expoPushToken on login, may need cleanup or be moved around
router.patch('/user/expoPushToken/:userId', certify, async (req, res, next) => {
  try {
    const user = await db.User.findOne({
      where: { id: req.params.userId },
    });
    const [message, status] = user
      ? ['Push Token updated', 200]
      : ['User not found', 404];
    if (status === 200) await user.update({ expoPushToken: req.body.pushToken });
    return res.status(status).send({ message });
  } catch (err) {
    next(err);
    return res.status(503).send({ message: 'Server error, try again later' });
  }
});

export default router;
