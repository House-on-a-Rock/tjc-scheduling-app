import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getSchedules, getTeams, postSchedule } from '../../apis';
import { useQueryConfig, getChurchMembersData } from './shared';

const useScheduleContainerData = (churchId, setDialogOpen) => {
  const queryClient = useQueryClient();
  const { isLoading: isTabsLoading, data: tabsData } = useQuery(
    ['tabs'],
    () => getSchedules(churchId),
    useQueryConfig,
  );

  const { isLoading: isUsersLoading, data: usersData } = useQuery(
    ['users'],
    () => getChurchMembersData(churchId),
    useQueryConfig,
  );

  const { isLoading: isTeamsLoading, data: teamsData } = useQuery(
    ['teams'],
    () => getTeams(churchId),
    useQueryConfig,
  );

  const createSchedule = useMutation(postSchedule, {
    onSuccess: () => {
      queryClient.invalidateQueries('tabs');
      queryClient.invalidateQueries('schedules');
      setDialogOpen(false);
    },
  });

  const returnData = {
    tabs: isTabsLoading ? null : tabsData.data,
    users: isUsersLoading ? null : usersData,
    teams: isTeamsLoading ? null : teamsData.data,
  };

  return [
    isTabsLoading,
    returnData.tabs,
    isUsersLoading,
    returnData.users,
    isTeamsLoading,
    returnData.teams,
    createSchedule,
  ];
};

export default useScheduleContainerData;
