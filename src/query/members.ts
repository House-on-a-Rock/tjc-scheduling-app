import { getAllUsers, getAllRoles, getAllUserRoles } from './apis';

export const getChurchMembersData = async (key: string, churchId: number) => {
  if (churchId) {
    const { data: users } = await getAllUsers(churchId);
    const { data: userRoles } = await getAllUserRoles(churchId);
    const { data: roles } = await getAllRoles(churchId);
    const usersWithTeammates = [];
    users.forEach((user) => {
      if (user.firstName) {
        const teams = [];
        userRoles.forEach((ur) => {
          if (user.userId === ur.user.id) {
            let teammates: any = {};
            roles.forEach((role) => {
              if (role.id === ur.roleId) teammates = { ...role };
            });
            if (teammates.id) teams.push(teammates);
          }
        });
        usersWithTeammates.push({ ...user, teams });
      }
    });
    return usersWithTeammates;
  }
  return [];
};
