import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  getSchedules,
  getTeams,
  postSchedule,
  destroySchedule,
  getTemplates,
} from '../../apis';
import { useQueryConfig, getChurchMembersData } from './shared';
import { createAlert } from '../../components/shared/Alert';

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

  const { isLoading: isTemplatesLoading, data: templatesData } = useQuery(
    ['templates'],
    () => getTemplates(churchId),
    useQueryConfig,
  );

  const createSchedule = useMutation(postSchedule, {
    onSuccess: (res) => {
      // immediately sets tabs to updated values, so schedule can switch to newly created tabs
      queryClient.setQueryData('tabs', res.data);
      onCreateScheduleSuccess({
        message: res.data.message,
        status: res.data.status,
      });
    },
    // onError: (res) => console.log(`res.response`, res.response),
  });

  const deleteScheduleMut = useMutation(destroySchedule, {
    onSuccess: (res) => setAlert(createAlert(res)),
  });

  const deleteSchedule = (scheduleId, title, tab) =>
    deleteScheduleMut.mutate(
      { scheduleId, title, churchId },
      {
        onSuccess: (res) => {
          onDeleteScheduleSuccess(tab);
          queryClient.setQueryData('tabs', res.data);
        },
      },
    );

  const returnData = {
    loaded: !isTabsLoading && !isUsersLoading && !isTeamsLoading,
    tabs: isTabsLoading ? null : tabsData.data,
    users: isUsersLoading ? null : usersData,
    teams: isTeamsLoading ? null : teamsData.data,
    templates: isTemplatesLoading ? null : templatesData.data,
  };

  return [
    returnData.loaded,
    returnData.tabs,
    returnData.users,
    returnData.teams,
    returnData.templates,
    createSchedule,
    deleteSchedule,
  ];
};

export default useScheduleContainerData;
