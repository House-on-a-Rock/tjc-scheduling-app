import axios from 'axios';
import { secretIp } from '../../secrets/secretStuff';
import { getLocalStorageItem } from '../shared/utilities';

export const getTeams = (churchId) => {
  return axios.get(`${secretIp}/api/roles?churchId=${churchId}`);
};
