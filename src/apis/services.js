import axios from 'axios';
import { secretIp } from '../../secrets/secretStuff';

const postService = (serviceInfo) => {
  return axios.post(`${secretIp}/api/service`, serviceInfo);
};

export default postService;
