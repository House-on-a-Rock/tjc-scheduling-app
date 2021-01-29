import axios, { AxiosResponse } from 'axios';
// import { secretIp } from '../../../secrets/secretStuff';
import {
  NewScheduleData,
  AddServiceProps,
  DeleteScheduleData,
} from '../../shared/types/models';
import { getLocalStorageItem } from '../../shared/utilities';

const secretIp = process.env.BASE_URL;

export const getSchedules = (churchId: number): Promise<AxiosResponse> => {
  const token = getLocalStorageItem('access_token')?.token;
  axios.defaults.headers.common.authorization = token;
  return axios.get(`${secretIp}/api/schedules?churchId=${churchId}`);
};

export const getScheduleAndData = (scheduleId: number): Promise<AxiosResponse> =>
  axios.get(`${secretIp}/api/schedule?scheduleId=${scheduleId}`);

export const postSchedule = (data: NewScheduleData) =>
  axios.post(`${secretIp}/api/schedule`, data);

export const destroySchedule = (data: DeleteScheduleData) =>
  axios.delete(`${secretIp}/api/schedule`, { data });

export const addService = (data: AddServiceProps) =>
  axios.post(`${secretIp}/api/service`, data);

export const destroyEvent = (eventId: string) => {
  return axios.delete(`${secretIp}/api/event`, { data: { eventId } });
};

export const updateScheduleAssignments = async (changedTasks: any) => {
  const response = await Promise.all(
    Object.entries(changedTasks).map((task) =>
      axios.patch(`${secretIp}/api/tasks/updateTask/${task[0]}/assignTo/${task[1]}`),
    ),
  );
  return response;
};
