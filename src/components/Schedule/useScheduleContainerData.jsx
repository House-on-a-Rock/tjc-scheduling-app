import { useQuery } from 'react-query';
import {
  getAllUsers,
  getAllRoles,
  getAllUserRoles,
  getSchedules,
  getTeams,
} from '../../apis/';

const useScheduleContainerData = (churchId) => {
  const useQueryConfig = {
    refetchOnWindowFocus: false,
    staleTime: 300000,
    cacheTime: 3000000,
  };

  const { isLoading: isTabsLoading, data: tabs } = useQuery(
    ['tabs'],
    () => getSchedules(churchId),
    useQueryConfig,
  );

  const { data: users } = useQuery(
    ['users'],
    () => getChurchMembersData(churchId),
    useQueryConfig,
  );

  const { data: teams } = useQuery(['teams'], () => getTeams(churchId), useQueryConfig);

  async function getChurchMembersData(churchId) {
    const { data: users } = await getAllUsers(churchId);
    const { data: userRoles } = await getAllUserRoles(churchId);
    const { data: roles } = await getAllRoles(churchId);
    const usersWithTeammates = [];
    users.forEach((user) => {
      const teams = [];
      userRoles.forEach((ur) => {
        if (user.userId === ur.user.id) {
          let teammates = {};
          roles.forEach((role) => {
            if (role.id === ur.roleId) teammates = { ...role };
          });
          if (teammates.id) teams.push(teammates);
        }
      });
      usersWithTeammates.push({ ...user, teams });
    });
    return usersWithTeammates;
  }

  return [isTabsLoading, tabs, users, teams];
};

export default useScheduleContainerData;
