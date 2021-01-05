import axios, { AxiosResponse } from 'axios';
import { NewServiceData } from '../../shared/types';

const secretIp = 'http://127.0.0.1:8081';

export const postService = (serviceInfo: NewServiceData): Promise<AxiosResponse> => {
  console.log('serviceInfo', serviceInfo);
  return axios.post(`${secretIp}/api/service`, serviceInfo);
};
