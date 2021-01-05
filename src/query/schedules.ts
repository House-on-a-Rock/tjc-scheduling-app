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

// export const createNewSchedule = async (newInfo: NewScheduleData) =>
//   (await postSchedule(newInfo)).data;

// Task Item- Pass in arrays as queries using library: qs
// useMutation can't seem to do batched deletes
// export const destroyEvents = ({
//   eventIds,
// }: DeleteEventsData): Promise<AxiosResponse<any>>[] =>
//   eventIds.map(async (eventId) => (await deleteEvent(eventId)).data);

// export const createSchedule = useMutation<
//   AxiosResponse<any>,
//   AxiosError,
//   NewScheduleData
// >(postSchedule, {
//   onSuccess: () => {
//     queryClient.invalidateQueries('tabs');
//     queryClient.invalidateQueries('schedules');
//     // setIsSuccess('NewScheduleForm');
//   },
//   // onError: (result) => errorHandling(result, setError),
//   // onSettled: () => setIsSuccess(''),
// });

// export const deleteSchedule = useMutation<
//   AxiosResponse<any>,
//   AxiosError,
//   DeleteScheduleData,
//   unknown
// >(destroySchedule, {
//   onSuccess: () => {
//     queryClient.invalidateQueries('tabs');
//     // setIsSuccess('DeleteSchedule');
//     // BUG: part 1: deleting incorrectly is successful; part 2: rerenders component
//   },
//   // onError: (result) => errorHandling(result, setError),
//   // onSettled: () => setIsSuccess(''),
// });
