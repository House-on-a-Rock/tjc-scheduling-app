import { getAllUsers, getAllRoles, getAllUserRoles } from '../../apis';

export const useQueryConfig = {
  refetchOnWindowFocus: false,
  staleTime: 300000,
  cacheTime: 3000000,
};

export async function getChurchMembersData(churchId) {
  const { data: users } = await getAllUsers(churchId);
  const { data: userRoles } = await getAllUserRoles(churchId);
  const { data: roles } = await getAllRoles(churchId);
  const usersWithTeammates = [];
  console.log({ users, userRoles, roles });
  users.forEach((user) => {
    const teams = [];
    userRoles.forEach((ur) => {
      if (user.userId === ur.user.id) {
        let teammates = {};
        roles.forEach((role) => {
          // console.log({ role, ur });
          if (role.id === ur.roleId) teammates = { ...role };
        });
        if (teammates.id) teams.push(teammates);
      }
    });
    usersWithTeammates.push({ ...user, teams });
  });
  console.log({ usersWithTeammates });
  return usersWithTeammates;
}
