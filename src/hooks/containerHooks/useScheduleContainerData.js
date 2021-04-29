import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getSchedules, getTeams, postSchedule, destroySchedule } from '../../apis';
import { useQueryConfig, getChurchMembersData } from './shared';
import { alertSuccess } from '../../components/shared/Alert';

const useScheduleContainerData = (churchId, onSuccessHandler, setAlert) => {
  const queryClient = useQueryClient();
  const { isLoading: isTabsLoading, data: tabsData } = useQuery(
    ['tabs'],
    () => getSchedules(churchId),
    {
      ...useQueryConfig,
      onSuccess: (res) => {
        console.log('on fetch tabs success', res);
      },
    },
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
    onSuccess: (res) => {
      queryClient.invalidateQueries('tabs');
      // queryClient.invalidateQueries('schedules');
      onSuccessHandler(false);
      setAlert(alertSuccess(res));
    },
  });

  const deleteSchedule = useMutation(destroySchedule, {
    onSuccess: (res) => {
      setAlert(alertSuccess(res));
      queryClient.invalidateQueries('tabs');
    },
  });

  const returnData = {
    loaded: !isTabsLoading && !isUsersLoading && !isTeamsLoading,
    tabs: isTabsLoading ? null : tabsData.data,
    users: isUsersLoading ? null : usersData,
    teams: isTeamsLoading ? null : teamsData.data,
  };

  return [
    returnData.loaded,
    returnData.tabs,
    returnData.users,
    returnData.teams,
    createSchedule,
    deleteSchedule,
  ];
};

export default useScheduleContainerData;
