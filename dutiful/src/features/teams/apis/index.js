import { axios } from 'lib/axios';
import { useQuery } from 'react-query';

export const TEAM = 'TEAM';
export const TEAMMATES = 'TEAMMATES';

const getTeams = (churchId) => {
  return axios.get(`/api/teams?churchId=${churchId}`);
};

// TODO abstract churchId api endpoints out- server reads from token

const getTeammates = (teamId) => axios.get(`/api/teammates?teamId=${teamId}`);

export const useTeams = (churchId) =>
  useQuery({ queryKey: [TEAM], queryFn: () => getTeams(churchId) });

export const useTeammates = (teamId, config) =>
  useQuery({
    queryKey: [TEAMMATES, teamId],
    queryFn: () => getTeammates(teamId),
    ...config,
  });
