import { axios } from 'lib/axios';
import { useQuery } from 'react-query';

export const USERS = 'USERS';

export function getUsers(churchId) {
  return axios.get(`/api/users?churchId=${churchId}`);
}

export function getUser(userId) {
  return axios.get(`/api/user/${userId}`);
}

export function destroyUser(userId) {
  return axios.delete(`/api/user/${userId}`);
}

export function addUser(data) {
  return axios.post('/api/user', data);
}

export const useUsers = (churchId, methods) =>
  useQuery({ queryKey: [USERS], queryFn: () => getUsers(churchId), ...methods });
