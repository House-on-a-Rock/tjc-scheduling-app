import axios, { AxiosResponse } from 'axios';
import { secretIp } from '../../../secrets/secretStuff';
// import { AddScheduleProps, AddServiceProps } from '../../shared/types/models';

export const getTemplates = (churchId: number): Promise<AxiosResponse> =>
  axios.get(`${secretIp}/api/templates?churchId=${churchId}`);
