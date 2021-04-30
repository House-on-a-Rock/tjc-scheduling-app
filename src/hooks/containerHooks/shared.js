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
  console.log(users, userRoles, roles);
  const usersWithTeammates = [];
  users.forEach((user) => {
    const teams = [];
    userRoles.forEach((ur) => {
      console.log('ur');
      if (user.userId === ur.user.id) {
        let teammates = {};
        roles.forEach((role) => {
          if (role.id === ur.roleId) teammates = { ...role };
        });
        if (teammates.id) teams.push(teammates);
      }
      console.log('usersWithTeammates', teams);
    });
    usersWithTeammates.push({ ...user, teams });
  });
  console.log('usersWithTeammates', usersWithTeammates);
  return usersWithTeammates;
}
