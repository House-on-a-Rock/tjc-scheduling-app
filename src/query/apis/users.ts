import axios, { AxiosResponse } from 'axios';
// import { secretIp } from '../../../secrets/secretStuff';
import { getLocalStorageItem } from '../../shared/utilities';
import { NewUserData } from '../../shared/types';
import config from '../config';

const secretIp = config.BASE_URL;

export function getAllUsers(churchId: number): Promise<AxiosResponse> {
  const token = getLocalStorageItem('access_token')?.token;
  axios.defaults.headers.common.authorization = token;
  return axios.get(`${secretIp}/api/users?churchId=${churchId}`);
}

export function getUser(userId: string): Promise<AxiosResponse> {
  return axios.get(`${secretIp}/api/user/${userId}`);
}

export function destroyUser(userId: number): Promise<AxiosResponse | void> {
  // only admins can delete, and they can't delete themselves
  return axios.delete(`${secretIp}/api/user/${userId}`);
}

export function addUser(data: NewUserData): Promise<AxiosResponse> {
  return axios.post(`${secretIp}/api/user`, data);
}
