import axios, { AxiosResponse } from 'axios';
import { secretIp } from '../../../secrets/secretStuff';
import {
  AddScheduleProps,
  AddServiceProps,
  DeleteScheduleProps,
} from '../../shared/types/models';

const accessToken = localStorage.getItem('access_token');
axios.defaults.headers.common.authorization = accessToken;

export const getTabs = (churchId: number): Promise<AxiosResponse> =>
  axios.get(`${secretIp}/api/schedules/tabs?churchId=${churchId}`);

export const getSchedule = (scheduleId: number): Promise<AxiosResponse> =>
  axios.get(`${secretIp}/api/schedules?scheduleId=${scheduleId}`);

export const addSchedule = ({
  scheduleTitle,
  startDate,
  endDate,
  view,
  team,
  churchId,
}: AddScheduleProps) =>
  axios.post(`${secretIp}/api/schedules`, {
    title: scheduleTitle,
    startDate,
    endDate,
    view,
    team,
    churchId,
  });

export const deleteSchedule = ({ scheduleId, title }: DeleteScheduleProps) =>
  axios.delete(`${secretIp}/api/schedules`, {
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
