import axios, { AxiosResponse } from 'axios';
import { secretIp } from '../../../secrets/secretStuff';
import { AddScheduleProps, AddServiceProps } from '../../shared/types/models';

const accessToken = localStorage.getItem('access_token') ?? '';
axios.defaults.headers.common.authorization = accessToken;

export const getSchedule = (churchId: number): Promise<AxiosResponse> => {
  return axios.get(`${secretIp}/api/schedules?churchId=${churchId}`);
};

export const addSchedule = ({
  scheduleTitle,
  startDate,
  endDate,
  view,
  team,
  churchId,
}: AddScheduleProps) => {
  console.log('scheduleTitle', scheduleTitle);
  return axios.post(`${secretIp}/api/schedules`, {
    title: scheduleTitle,
    startDate,
    endDate,
    view,
    team,
    churchId,
  });
};

export const addService = ({ name, order, dayOfWeek, scheduleId }: AddServiceProps) =>
  axios.post(`${secretIp}/api/services`, {
    name,
    order,
    dayOfWeek,
    scheduleId,
  });
