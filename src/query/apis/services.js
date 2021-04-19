import axios from 'axios';
const secretIp = 'http://127.0.0.1:8081';

export const postService = (serviceInfo) => {
  return axios.post(`${secretIp}/api/service`, serviceInfo);
};
