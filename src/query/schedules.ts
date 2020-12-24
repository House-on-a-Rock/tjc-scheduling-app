import { getSchedule, getTabs } from './apis/schedules';

export const getScheduleData = async (key: string, scheduleId: number) =>
  (await getSchedule(scheduleId)).data;

export const getTabData = async (key: string, churchId: number) =>
  (await getTabs(churchId)).data;
