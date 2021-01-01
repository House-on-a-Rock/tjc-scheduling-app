import axios, { AxiosResponse } from 'axios';
import { secretIp } from '../../../secrets/secretStuff';
import { getLocalStorageItem } from '../../shared/utilities';
// import { AddScheduleProps, AddServiceProps } from '../../shared/types/models';

export const getTemplates = (churchId: number): Promise<AxiosResponse> => {
  const token = getLocalStorageItem('access_token')?.token;
  axios.defaults.headers.common.authorization = token;
  return axios.get(`${secretIp}/api/templates?churchId=${churchId}`);
};
