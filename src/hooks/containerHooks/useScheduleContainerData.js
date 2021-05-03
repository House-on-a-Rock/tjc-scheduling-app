import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getSchedules, getTeams, postSchedule, destroySchedule } from '../../apis';
import { useQueryConfig, getChurchMembersData } from './shared';
import { sendAlert } from '../../components/shared/Alert';

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
      onSuccessHandler(false);
      setAlert(sendAlert(res));
    },
  });

  const deleteScheduleMut = useMutation(destroySchedule, {
    onSuccess: (res) => {
      setAlert(sendAlert(res));
      // queryClient.invalidateQueries('tabs');
      // onDeleteSchedule();
    },
  });

  const deleteSchedule = (scheduleId, title, tab) =>
    deleteScheduleMut.mutate(
      { scheduleId, title },
      {
        onSuccess: () => {
          onDeleteSchedule(tab);
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
