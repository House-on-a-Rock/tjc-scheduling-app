import axios, { AxiosResponse } from 'axios';
import { NewServiceData } from '../../shared/types';

const secretIp = process.env.BASE_URL;

export const postService = (serviceInfo: NewServiceData): Promise<AxiosResponse> => {
  return axios.post(`${secretIp}/api/service`, serviceInfo);
};
