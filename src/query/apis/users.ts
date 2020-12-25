import axios, { AxiosResponse } from 'axios';
import { secretIp } from '../../../secrets/secretStuff';
import { extractTokenInfo } from '../../shared/utilities';
import { AddUserProps } from '../../shared/types';

const accessToken = localStorage.getItem('access_token') ?? '';
axios.defaults.headers.common.authorization = accessToken;

export function getAllUsers(churchId: number): Promise<AxiosResponse> {
  return axios.get(`${secretIp}/api/users?churchId=${churchId}`);
}

export function getUser(userId: string): Promise<AxiosResponse> {
  return axios.get(`${secretIp}/api/user/${userId}`);
}

export function deleteUser(userId: number): Promise<AxiosResponse | void> {
  const currentUserId = extractTokenInfo(accessToken, 'userId')[0];
  return currentUserId === userId.toString()
    ? new Promise(() => console.error("bruh, you can't delete yourself what"))
    : axios.delete(`${secretIp}/api/user/${userId}`);
}

export function addUser({
  email,
  firstName,
  lastName,
  password,
  churchId,
}: AddUserProps): Promise<AxiosResponse> {
  return axios.post(`${secretIp}/api/user`, {
    email: email,
    firstName: firstName,
    lastName: lastName,
    password: password,
    churchId: churchId,
  });
}
