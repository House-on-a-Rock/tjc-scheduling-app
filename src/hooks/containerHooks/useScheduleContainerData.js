import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getSchedules, getTeams, postSchedule, destroySchedule } from '../../apis';
import { useQueryConfig, getChurchMembersData } from './shared';
import { sendAlert } from '../../components/shared/Alert';

const useScheduleContainerData = (
  churchId,
  setAlert,
  onCreateScheduleSuccess,
  onDeleteScheduleSuccess,
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
      // immediately sets tabs to updated values, so schedule can switch to newly created tabs
      queryClient.setQueryData('tabs', res.data);

      onCreateScheduleSuccess({ data: res.data.message, status: res.status });
    },
  });

  const deleteScheduleMut = useMutation(destroySchedule, {
    onSuccess: (res) => setAlert(sendAlert(res)),
  });

  const deleteSchedule = (scheduleId, title, tab) =>
    deleteScheduleMut.mutate(
      { scheduleId, title },
      {
        onSuccess: () => {
          onDeleteScheduleSuccess(tab);
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
