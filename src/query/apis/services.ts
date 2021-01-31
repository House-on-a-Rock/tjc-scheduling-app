import axios, { AxiosResponse } from 'axios';
import { NewServiceData } from '../../shared/types';
import config from '../config';

const secretIp = config.BASE_URL;

export const postService = (serviceInfo: NewServiceData): Promise<AxiosResponse> => {
  return axios.post(`${secretIp}/api/service`, serviceInfo);
};
