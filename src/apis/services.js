import axios from 'axios';
import { secretIp } from '../../secrets/secretStuff';

export const postService = (serviceInfo) => {
  return axios.post(`${secretIp}/api/service`, serviceInfo);
};
