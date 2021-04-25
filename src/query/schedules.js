import { getScheduleAndData, getSchedules } from './apis/schedules';

export const getScheduleData = async (scheduleIds) => {
  return scheduleIds.length > 0
    ? Promise.all(
        scheduleIds?.map(
          async (scheduleId) => (await getScheduleAndData(scheduleId)).data,
        ),
      )
    : [];
};

// unused
export const getAllSchedules = async (churchId) => {
  return (await getSchedules(churchId)).data;
};
