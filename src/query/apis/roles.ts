import axios, { AxiosResponse } from 'axios';
import config from '../config';
// import { secretIp } from '../../../secrets/secretStuff';
import { getLocalStorageItem } from '../../shared/utilities';

const secretIp = config.BASE_URL;

export function getAllRoles(churchId: number): Promise<AxiosResponse> {
  const token = getLocalStorageItem('access_token')?.token;
  axios.defaults.headers.common.authorization = token;
  return axios.get(`${secretIp}/api/roles?churchId=${churchId}`);
}
