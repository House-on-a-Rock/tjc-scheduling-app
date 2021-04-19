import axios from 'axios';
import { secretIp } from '../../../secrets/secretStuff';
import { getLocalStorageItem } from '../../shared/utilities';

export const getSchedules = (churchId) => {
  const token = getLocalStorageItem('access_token')?.token;
  axios.defaults.headers.common.authorization = token;
  return axios.get(`${secretIp}/api/schedules?churchId=${churchId}`);
};

export const getScheduleAndData = (scheduleId) =>
  axios.get(`${secretIp}/api/schedule?scheduleId=${scheduleId}`);

export const postSchedule = (data) => axios.post(`${secretIp}/api/schedule`, data);

export const destroySchedule = (data) =>
  axios.delete(`${secretIp}/api/schedule`, { data });

export const addService = (data) => axios.post(`${secretIp}/api/service`, data);

export const destroyEvent = (eventId) => {
  return axios.delete(`${secretIp}/api/event`, { data: { eventId } });
};

export const updateScheduleAssignments = async (changedTasks) => {
  const response = await Promise.all(
    Object.entries(changedTasks).map((task) =>
      axios.patch(`${secretIp}/api/tasks/updateTask/${task[0]}/assignTo/${task[1]}`),
    ),
  );
  return response;
};
