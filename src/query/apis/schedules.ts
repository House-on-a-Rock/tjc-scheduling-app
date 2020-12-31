import axios, { AxiosResponse } from 'axios';
import { secretIp } from '../../../secrets/secretStuff';
import {
  AddScheduleProps,
  AddServiceProps,
  DeleteScheduleProps,
  DeleteEventProps,
} from '../../shared/types/models';
import { getLocalStorageItem } from '../../shared/utilities';

export const getTabs = (churchId: number): Promise<AxiosResponse> => {
  const token = getLocalStorageItem('access_token')?.token;
  axios.defaults.headers.common.authorization = token;
  return axios.get(`${secretIp}/api/schedules/tabs?churchId=${churchId}`);
};

export const getSchedule = (scheduleId: number): Promise<AxiosResponse> =>
  axios.get(`${secretIp}/api/schedules?scheduleId=${scheduleId}`);

export const addSchedule = async ({
  scheduleTitle,
  startDate,
  endDate,
  view,
  team,
  churchId,
  templateId,
}: any) =>
  await axios.post(`${secretIp}/api/schedules`, {
    title: scheduleTitle,
    startDate,
    endDate,
    view,
    team,
    churchId,
    templateId,
  });

export const deleteSchedule = ({ scheduleId, title }: DeleteScheduleProps) =>
  axios.delete(`${secretIp}/api/schedules`, {
    data: {
      scheduleId,
      title,
    },
  });

export const deleteEvent = ({ eventId }: DeleteEventProps) =>
  axios.delete(`${secretIp}/api/events`, {
    data: {
      eventId,
    },
  });

export const addService = ({ name, order, dayOfWeek, scheduleId }: AddServiceProps) =>
  axios.post(`${secretIp}/api/services`, {
    name,
    order,
    dayOfWeek,
    scheduleId,
  });

export const updateScheduleAssignments = async (changedTasks: any) => {
  const response = await Promise.all(
    Object.entries(changedTasks).map((task) =>
      axios.patch(`${secretIp}/api/tasks/updateTask/${task[0]}/assignTo/${task[1]}`),
    ),
  );
  return response;
};
