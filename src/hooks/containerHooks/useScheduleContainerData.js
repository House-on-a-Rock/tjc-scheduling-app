import { useQuery } from 'react-query';
import { getSchedules, getTeams } from '../../apis';
import { useQueryConfig, getChurchMembersData } from './shared';

const useScheduleContainerData = (churchId) => {
  const { isLoading: isTabsLoading, data: tabs } = useQuery(
    ['tabs'],
    () => getSchedules(churchId),
    useQueryConfig,
  );

  const { isLoading: isUsersLoading, data: users } = useQuery(
    ['users'],
    () => getChurchMembersData(churchId),
    useQueryConfig,
  );

  const { isLoading: isTeamsLoading, data: teams } = useQuery(
    ['teams'],
    () => getTeams(churchId),
    useQueryConfig,
  );

  return [isTabsLoading, tabs, isUsersLoading, users, isTeamsLoading, teams];
};

export default useScheduleContainerData;
