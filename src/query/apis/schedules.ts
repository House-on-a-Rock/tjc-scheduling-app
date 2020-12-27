import axios, { AxiosResponse } from 'axios';
import { secretIp } from '../../../secrets/secretStuff';
import {
  NewScheduleData,
  AddServiceProps,
  DeleteScheduleProps,
} from '../../shared/types/models';
import { getLocalStorageItem } from '../../shared/utilities';

export const getTabs = (churchId: number): Promise<AxiosResponse> => {
  const token = getLocalStorageItem('access_token')?.token;
  axios.defaults.headers.common.authorization = token;
  return axios.get(`${secretIp}/api/schedules/tabs?churchId=${churchId}`);
};

export const getSchedule = (scheduleId: number): Promise<AxiosResponse> =>
  axios.get(`${secretIp}/api/schedule?scheduleId=${scheduleId}`);

export const postSchedule = ({
  scheduleTitle,
  startDate,
  endDate,
  view,
  team,
  churchId,
}: NewScheduleData) =>
  axios.post(`${secretIp}/api/schedule`, {
    title: scheduleTitle,
    startDate,
    endDate,
    view,
    team,
    churchId,
  });

export const destroySchedule = ({ scheduleId, title }: DeleteScheduleProps) =>
  axios.delete(`${secretIp}/api/schedule`, {
    data: {
      scheduleId,
      title,
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
