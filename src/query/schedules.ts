import { getScheduleAndData, getSchedules } from './apis/schedules';

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
