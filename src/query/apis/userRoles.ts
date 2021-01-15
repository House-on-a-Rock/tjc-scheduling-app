import axios, { AxiosResponse } from 'axios';
import { secretIp } from '../../../secrets/secretStuff';
import { getLocalStorageItem } from '../../shared/utilities';
import { UserRoleData } from '../../shared/types';

export function getAllUserRoles(churchId: number): Promise<AxiosResponse> {
  const token = getLocalStorageItem('access_token')?.token;
  axios.defaults.headers.common.authorization = token;
  return axios.get(`${secretIp}/api/user-roles?churchId=${churchId}`);
}

export function getTeamsData(churchId: number): Promise<AxiosResponse> {
  const token = getLocalStorageItem('access_token')?.token;
  axios.defaults.headers.common.authorization = token;
  return axios.get(`${secretIp}/api/teamsdata?churchId=${churchId}`);
}

export function postUserRole(newUserInfo: UserRoleData): Promise<AxiosResponse> {
  const token = getLocalStorageItem('access_token')?.token;
  axios.defaults.headers.common.authorization = token;
  return axios.post(`${secretIp}/api/user-role`, newUserInfo);
}

export function deleteUserRole(deletedUserInfo: UserRoleData): Promise<AxiosResponse> {
  const token = getLocalStorageItem('access_token')?.token;
  axios.defaults.headers.common.authorization = token;
  return axios.delete(`${secretIp}/api/user-role`, { data: deletedUserInfo });
}
