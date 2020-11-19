import axios, { AxiosResponse } from 'axios';
import { secretIp } from '../../../secrets/secretStuff';

const accessToken = localStorage.getItem('access_token') ?? '';
axios.defaults.headers.common.authorization = accessToken;

export function getUserRoles(userId: number): Promise<AxiosResponse> {
  return axios.get(`${secretIp}/api/user-roles/${userId}`);
}
