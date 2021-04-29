import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getSchedules, getTeams, postSchedule, destroySchedule } from '../../apis';
import { useQueryConfig, getChurchMembersData } from './shared';
import { alertStatus } from '../../components/shared/Alert';

const useScheduleContainerData = (
  churchId,
  onSuccessHandler,
  setAlert,
  onDeleteSchedule,
) => {
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
    onSuccess: (res) => {
      queryClient.invalidateQueries('tabs');
      // queryClient.invalidateQueries('schedules');
      onSuccessHandler(false);
      setAlert({ status: alertStatus[res.status], message: res.data });
    },
  });

  const deleteScheduleMutation = useMutation(destroySchedule, {
    onSuccess: () => {},
  });

  const deleteSchedule = (scheduleId, title, tab) =>
    deleteScheduleMutation.mutate(
      { scheduleId: scheduleId, title: title },
      {
        onSuccess: (res) => {
          console.log('1');
          setAlert({ status: alertStatus[res.status], message: res.data });
          console.log('2');
          onDeleteSchedule(tab);
          console.log('3');
          queryClient.invalidateQueries('tabs');
        },
      },
    );

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
