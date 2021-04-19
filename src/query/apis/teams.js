import axios, { AxiosResponse } from 'axios';
import { secretIp } from '../../../secrets/secretStuff';

export const getTeams = (churchId: number): Promise<AxiosResponse> => {
  return axios.get(`${secretIp}/api/roles?churchId=${churchId}`);
};
