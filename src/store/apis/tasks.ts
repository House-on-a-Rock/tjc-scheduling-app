import axios, { AxiosResponse } from 'axios';
import { secretIp } from '../../../secrets/secretStuff';

const accessToken = localStorage.getItem('access_token') ?? '';
axios.defaults.headers.common.authorization = accessToken;

export function getUserTasks(userId: number): Promise<AxiosResponse> {
  return axios.get(`${secretIp}/api/tasks?userId=${userId}`);
}
