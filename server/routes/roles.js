import express from 'express';
import Sequelize from 'sequelize';

import db from '../index';
import { certify } from '../utilities/helperFunctions';

const router = express.Router();

router.get('/roles', certify, async (req, res, next) => {
  try {
    const { churchId } = req.query;
    if (!churchId) return res.status(404);

    const roles = await db.Role.findAll({
      where: { churchId: churchId.toString() },
      attributes: ['id', 'name'],
    });
    const teammates = await db.UserRole.findAll({
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
    const rolesWithAssociatedUsers = roles.map((role) => {
      const filteredByRole = teammates
        .filter((userRole) => userRole.roleId === role.id && role.name !== 'Any')
        .map((ur) => ({
          teamLead: ur.teamLead,
          firstName: ur.user.firstName,
          lastName: ur.user.lastName,
        }));
      return { id: role.id, name: role.name, users: filteredByRole };
    });
    return res.status(200).json(rolesWithAssociatedUsers);
  } catch (err) {
    next(err);
    return res.status(503).send({ message: 'Server error, try again later' });
  }
});

router.get('/teams', certify, async (req, res, next) => {
  try {
    const { churchId } = req.query;
    if (!churchId) return res.status(401);
    const roles = await db.Role.findAll({
      where: { churchId: churchId.toString() },
      attributes: ['id', 'name'],
    });

    return res.status(200).json(roles);
  } catch (err) {
    next(err);
    return res.status(503).send({ message: 'Server error, try again later' });
  }
});

router.get('/teammates', certify, async (req, res, next) => {
  try {
    const { teamId } = req.query;
    if (!teamId) return res.json(401);

    // const roles = await db.Role.findAll({
    //   where: { churchId: churchId.toString() },
    //   attributes: ['id', 'name'],
    // });
    const teammates = await db.UserRole.findAll({
      where: { roleId: teamId.toString() },
      attributes: ['id', 'teamLead', 'roleId'],
      include: [
        { model: db.User, as: 'user', attributes: ['id', 'firstName', 'lastName'] },
      ],
    }).map((ur) => ({
      teamLead: ur.teamLead,
      firstName: ur.user.firstName,
      lastName: ur.user.lastName,
      userId: ur.user.id,
    }));
    // const rolesWithAssociatedUsers = roles.map((role) => {
    //   const filteredByRole = teammates
    //     .filter((userRole) => userRole.roleId === role.id && role.name !== 'Any')
    //     .map((ur) => ({
    //       teamLead: ur.teamLead,
    //       firstName: ur.user.firstName,
    //       lastName: ur.user.lastName,
    //     }));
    //   return { id: role.id, name: role.name, users: filteredByRole };
    // });
    return res.status(200).json(teammates);
  } catch (err) {
    next(err);
    return res.status(503).send({ message: 'Server error, try again later' });
  }
});

export default router;
