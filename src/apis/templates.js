import axios from 'axios';
import { secretIp } from '../../secrets/secretStuff';
import { getLocalStorageItem } from '../shared/utilities';

export const getTemplates = (churchId) => {
  const token = getLocalStorageItem('access_token')?.token;
  axios.defaults.headers.common.authorization = token;
  return axios.get(`${secretIp}/api/templates?churchId=${churchId}`);
};
