import axios from 'axios';
import { secretIp } from '../../secrets/secretStuff';
import { getLocalStorageItem } from '../shared/utilities';

function getUserTasks(userId) {
  const token = getLocalStorageItem('access_token')?.token;
  axios.defaults.headers.common.authorization = token;
  return axios.get(`${secretIp}/api/tasks?userId=${userId}`);
}

export default getUserTasks;
