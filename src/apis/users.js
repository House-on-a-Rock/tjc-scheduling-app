import axios from 'axios';
import { secretIp } from '../../secrets/secretStuff';
import { getLocalStorageItem } from '../shared/utilities';

export function getAllUsers(churchId) {
  const token = getLocalStorageItem('access_token')?.token;
  axios.defaults.headers.common.authorization = token;
  return axios.get(`${secretIp}/api/users?churchId=${churchId}`);
}

export function getUser(userId) {
  return axios.get(`${secretIp}/api/user/${userId}`);
}

export function destroyUser(userId) {
  // only admins can delete, and they can't delete themselves
  return axios.delete(`${secretIp}/api/user/${userId}`);
}

export function addUser(data) {
  return axios.post(`${secretIp}/api/user`, data);
}

export function requestAvailabilities(apiData) {
  // data should include start, end, deadline and churchid
  const { churchId, ...data } = apiData;
  return axios.post(`${secretIp}/api/user/${churchId}/request-availabilities`, data);
}
