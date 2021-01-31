import axios, { AxiosResponse } from 'axios';
// import { secretIp } from '../../../secrets/secretStuff';
import { getLocalStorageItem } from '../../shared/utilities';
import config from '../config';

const secretIp = config.BASE_URL;

export function getAllUserRoles(churchId: number): Promise<AxiosResponse> {
  const token = getLocalStorageItem('access_token')?.token;
  axios.defaults.headers.common.authorization = token;
  return axios.get(`${secretIp}/api/user-roles?churchId=${churchId}`);
}
