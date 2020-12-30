import { NewScheduleData } from '../shared/types';
import { getScheduleAndData, getSchedules, postSchedule } from './apis/schedules';

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
