import axios from 'axios';
import { secretIp } from '../../../secrets/secretStuff';

export const getTeams = (churchId) => {
  return axios.get(`${secretIp}/api/roles?churchId=${churchId}`);
};
