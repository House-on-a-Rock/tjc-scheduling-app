import { axios } from 'lib/axios';
import { useQuery } from 'react-query';

const getTeams = (churchId) => {
  return axios.get(`/api/teams?churchId=${churchId}`);
};

// TODO abstract churchId api endpoints out- server reads from token

const getTeammates = (teamId) => axios.get(`/api/teammates?teamId=${teamId}`);

export const useTeams = (churchId) =>
  useQuery({ queryKey: ['teams'], queryFn: () => getTeams(churchId) });

export const useTeammates = (teamId, config) =>
  useQuery({
    queryKey: ['teammates', teamId],
    queryFn: () => getTeammates(teamId),
    ...config,
  });
