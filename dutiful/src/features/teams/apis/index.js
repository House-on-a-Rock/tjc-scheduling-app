import { axios } from 'lib/axios';
import { useQuery } from 'react-query';

const getTeams = (churchId) => {
  return axios.get(`/api/roles?churchId=${churchId}`);
};

export const useTeams = (churchId) =>
  useQuery({ queryKey: ['teams'], queryFn: () => getTeams(churchId) });
