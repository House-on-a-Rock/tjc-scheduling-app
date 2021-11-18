import { axios } from 'lib/axios';
import { useQuery } from 'react-query';

export function getUsers(churchId) {
  return axios.get(`/api/users?churchId=${churchId}`);
}

export function getUser(userId) {
  return axios.get(`/api/user/${userId}`);
}

export function destroyUser(userId) {
  // only admins can delete, and they can't delete themselves
  return axios.delete(`/api/user/${userId}`);
}

export function addUser(data) {
  return axios.post('/api/user', data);
}

export const useUsers = (churchId) => {
  console.log({ churchId });
  return useQuery({ queryKey: ['users'], queryFn: () => getUsers(churchId) });
};
