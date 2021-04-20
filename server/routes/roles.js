import express from 'express';
import Sequelize from 'sequelize';
import { certify } from '../utilities/helperFunctions';
import db from '../index';

const router = express.Router();

router.get('/roles', certify, async (req, res, next) => {
  try {
    const { churchId } = req.query;
    if (churchId) {
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

export default router;
