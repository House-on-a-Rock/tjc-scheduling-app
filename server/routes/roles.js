import express, { Request, Response, NextFunction } from 'express';
import { RoleInstance, UserRoleInstance } from 'shared/SequelizeTypings/models';
import Sequelize from 'sequelize';
import { certify } from '../utilities/helperFunctions';
import db from '../index';

const router = express.Router();

module.exports = router;

router.get('/roles', certify, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { churchId } = req.query;
    if (churchId) {
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
        ],
      });
      const rolesWithAssociatedUsers = roles.map((role) => {
        const filteredByRole = userRoles.filter(
          (userRole) => userRole.roleId === role.id,
        );
        return { id: role.id, name: role.name, users: filteredByRole };
      });
      return res.status(200).json(rolesWithAssociatedUsers);
    }
  } catch (err) {
    next(err);
    return res.status(503).send({ message: 'Server error, try again later' });
  }
});
