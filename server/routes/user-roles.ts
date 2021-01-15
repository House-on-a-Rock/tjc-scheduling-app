import express, { Request, Response, NextFunction } from 'express';
import Sequelize from 'sequelize';
import { v4 as uuid } from 'uuid';
import { RoleInstance, UserRoleInstance } from 'shared/SequelizeTypings/models';
import { certify } from '../utilities/helperFunctions';
import db from '../index';

const router = express.Router();

module.exports = router;

router.get(
  '/user-roles',
  certify,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { churchId } = req.query;
      const roles: RoleInstance[] = await db.Role.findAll({
        where: { churchId: churchId.toString() },
        attributes: ['id', 'name'],
      });

      const userRoles: UserRoleInstance[] = await db.UserRole.findAll({
        where: {
          roleId: {
            [Sequelize.Op.or]: roles.map((role) => role.id),
          },
        },
        attributes: ['id', 'teamLead', 'roleId'],
        include: [
          { model: db.User, as: 'user', attributes: ['id', 'firstName', 'lastName'] },
          { model: db.Role, as: 'role', attributes: ['name'] },
        ],
      });
      return res.status(200).json(userRoles);
    } catch (err) {
      next(err);
      return res.status(503).send({ message: 'Server error, try again later' });
    }
  },
);

router.get(
  '/teamsdata',
  certify,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { churchId } = req.query;
      const roles: RoleInstance[] = await db.Role.findAll({
        where: { churchId: churchId.toString() },
        attributes: ['id', 'name'],
      });

      const userRoles: UserRoleInstance[] = await db.UserRole.findAll({
        where: {
          roleId: {
            [Sequelize.Op.or]: roles.map((role) => role.id),
          },
        },
        attributes: ['id', 'teamLead', 'roleId'],
        include: [
          { model: db.User, as: 'user', attributes: ['id', 'firstName', 'lastName'] },
          { model: db.Role, as: 'role', attributes: ['id', 'name'] },
        ],
      });
      const formattedData = [];

      roles.map((role) => {
        const members = [];
        userRoles.map((userRole) => {
          if (role.name === userRole.role.name)
            members.push({
              id: uuid(),
              userId: userRole.user.id,
              name: `${userRole.user.firstName} ${userRole.user.lastName}`,
            });
        });
        if (members.length > 0)
          formattedData.push({ role: role.name, roleId: role.id, members: members });
      });
      return res.status(200).json(formattedData);
    } catch (err) {
      next(err);
      return res.status(503).send({ message: 'Server error, try again later' });
    }
  },
);

router.get(
  '/user-role/:userId',
  certify,
  async (req: Request, res: Response, next: NextFunction) => {
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
  },
);

router.post(
  '/user-role',
  certify,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { roleId, userId } = req.body;
      await db.UserRole.create({
        teamLead: false,
        userId,
        roleId,
      });
      return res.status(201).send({ message: 'User added' });
    } catch (err) {
      next(err);
      return res.status(503).send({ message: 'Server error, try again later' });
    }
  },
);

router.delete(
  '/user-role',
  certify,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { roleId, userId } = req.body;
      await db.UserRole.destroy({ where: { roleId, userId } });
      return res.status(200).send({ message: 'User deleted' });
    } catch (err) {
      next(err);
      return res.status(503).send({ message: 'Server error, try again later' });
    }
  },
);
