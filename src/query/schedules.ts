import { getScheduleAndData, getSchedules } from './apis/schedules';
import { AxiosResponse, AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { DeleteScheduleData, NewScheduleData } from '../shared/types';
import { postSchedule, destroySchedule } from './apis';

// const queryClient = useQueryClient();

export const getScheduleData = async (scheduleIds: number[]) => {
  return scheduleIds.length > 0
    ? Promise.all(
        scheduleIds?.map(
          async (scheduleId) => (await getScheduleAndData(scheduleId)).data,
        ),
      )
    : [];
};

export const getAllSchedules = async (churchId: number) => {
  return (await getSchedules(churchId)).data;
};

// Task Item- Pass in arrays as queries using library: qs
// useMutation can't seem to do batched deletes
// export const destroyEvents = ({
//   eventIds,
// }: DeleteEventsData): Promise<AxiosResponse<any>>[] =>
//   eventIds.map(async (eventId) => (await deleteEvent(eventId)).data);
