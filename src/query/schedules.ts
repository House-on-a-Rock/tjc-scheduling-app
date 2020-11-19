import { getSchedule } from '../store/apis/schedules';

export const getScheduleData = async (key: string, churchId: number) =>
  (await getSchedule(churchId)).data;
