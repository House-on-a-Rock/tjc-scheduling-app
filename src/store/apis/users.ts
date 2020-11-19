import axios, { AxiosResponse } from 'axios';
import { secretIp } from '../../../secrets/secretStuff';
import { extractUserId } from '../../shared/utilities';
import { AddUserProps } from '../../shared/types';

const accessToken = localStorage.getItem('access_token') ?? '';
axios.defaults.headers.common.authorization = accessToken;

export function getAllUsers(): Promise<AxiosResponse> {
  return axios.get(`${secretIp}/api/users`);
}

export function getAllLocalMembers(churchId: number): Promise<AxiosResponse> {
  return axios.get(`${secretIp}/api/users?churchId=${churchId}`);
}

export function getUser(userId: number): Promise<AxiosResponse> {
  return axios.get(`${secretIp}/api/users/${userId}`);
}

export function deleteUser(userId: number): Promise<AxiosResponse | void> {
  const loggedInUserId = extractUserId(accessToken);
  if (loggedInUserId === userId)
    return new Promise(() => console.error("bruh, you can't delete yourself what"));
  return axios.delete(`${secretIp}/api/users/${userId}`);
}

export function addUser({
  email,
  firstName,
  lastName,
  password,
  churchId,
}: AddUserProps): Promise<AxiosResponse> {
  return axios.post(`${secretIp}/api/users`, {
    email: email,
    firstName: firstName,
    lastName: lastName,
    password: password,
    churchId: churchId,
  });
}
