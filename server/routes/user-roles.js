import express from 'express';
import Sequelize from 'sequelize';
import { certify } from '../utilities/helperFunctions';
import db from '../index';

const router = express.Router();

router.get('/user-roles', certify, async (req, res, next) => {
  try {
    const { churchId } = req.query;
    const roles = await db.Role.findAll({
      where: { churchId: churchId.toString() },
      attributes: ['id', 'name'],
    });

    const userRoles = await db.UserRole.findAll({
      where: {
        roleId: {
          [Sequelize.Op.or]: roles.map((role) => role.id),
        },
      },
      attributes: ['id', 'teamLead', 'roleId'],
      include: [
        { model: db.User, as: 'user', attributes: ['id', 'firstName', 'lastName'] },
      ],
    });
    return res.status(200).json(userRoles);
  } catch (err) {
    next(err);
    return res.status(503).send({ message: 'Server error, try again later' });
  }
});

router.get('/user-role/:userId', certify, async (req, res, next) => {
  try {
    const userRoles = await db.UserRole.findAll({
      where: { userId: req.params.userId.toString() },
      attributes: ['roleId'],
      include: [
        {
          model: db.Role,
          as: 'role',
          attributes: ['name'],
        },
      ],
    });
    return userRoles
      ? res.status(200).json(userRoles)
      : res.status(404).send({ message: 'Not found' });
  } catch (err) {
    next(err);
    return res.status(503).send({ message: 'Server error, try again later' });
  }
});
export default router;
