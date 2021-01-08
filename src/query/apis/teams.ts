import axios, { AxiosResponse } from 'axios';
import { secretIp } from '../../../secrets/secretStuff';
// import { getLocalStorageItem } from '../../shared/utilities';

export const getTeams = (churchId: number): Promise<AxiosResponse> => {
  // const token = getLocalStorageItem('access_token')?.token;
  // axios.defaults.headers.common.authorization = token;
  return axios.get(`${secretIp}/api/roles?churchId=${churchId}`);
};
