import axios from 'axios';
import { secretIp } from '../../secrets/secretStuff';
import { getLocalStorageItem } from '../shared/utilities';

function getAllUserRoles(churchId) {
  const token = getLocalStorageItem('access_token')?.token;
  axios.defaults.headers.common.authorization = token;
  return axios.get(`${secretIp}/api/user-roles?churchId=${churchId}`);
}

export default getAllUserRoles;
