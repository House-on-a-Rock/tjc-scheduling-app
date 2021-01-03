import axios, { AxiosResponse } from 'axios';
import { secretIp } from '../../../secrets/secretStuff';
import { getLocalStorageItem } from '../../shared/utilities';
import { NewUserData } from '../../shared/types';

export function getAllUsers(churchId: number): Promise<AxiosResponse> {
  const token = getLocalStorageItem('access_token')?.token;
  axios.defaults.headers.common.authorization = token;
  return axios.get(`${secretIp}/api/users?churchId=${churchId}`);
}

export function getUser(userId: string): Promise<AxiosResponse> {
  return axios.get(`${secretIp}/api/user/${userId}`);
}

export function destroyUser(userId: number): Promise<AxiosResponse | void> {
  // const token = useToken();
  // const currentUserId = extractTokenInfo(accessToken, 'userId')[0];
  return axios.delete(`${secretIp}/api/user/${userId}`);
  // currentUserId === userId.toString()
  //   ? new Promise(() => console.error("bruh, you can't delete yourself what"))
  //   :
}

export function addUser({
  email,
  firstName,
  lastName,
  churchId,
}: NewUserData): Promise<AxiosResponse> {
  return axios.post(`${secretIp}/api/user`, {
    email: email,
    firstName: firstName,
    lastName: lastName,
    churchId: churchId,
  });
}
