import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  getSchedules,
  getTeams,
  postSchedule,
  destroySchedule,
  getTemplates,
} from '../../apis';
import { useQueryConfig, getChurchMembersData } from './shared';

const useScheduleContainerData = (
  churchId,
  setAlert,
  onCreateScheduleSuccess,
  onDeleteScheduleSuccess,
  setIsEditMode,
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
      queryClient.setQueryData('tabs', res.data);
      onCreateScheduleSuccess(res);
    },
    // if the error is the title already exists, the form handles it. other errors tho?
    // onError: (res) => {
    //   console.log(`res.response`, res.response);
    // },
  });

  const deleteScheduleMut = useMutation(destroySchedule, {
    onSuccess: (res) => setAlert(res),
  });

  const deleteSchedule = (scheduleId, title, tab) =>
    deleteScheduleMut.mutate(
      { scheduleId, title, churchId },
      {
        onSuccess: (res) => {
          onDeleteScheduleSuccess(tab);
          queryClient.setQueryData('tabs', res.data);
          setIsEditMode(false);
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
