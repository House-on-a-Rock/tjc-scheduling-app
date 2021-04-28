import axios from 'axios';
import { secretIp } from '../../secrets/secretStuff';

const getTeams = (churchId) => {
  return axios.get(`${secretIp}/api/roles?churchId=${churchId}`);
};

export default getTeams;
