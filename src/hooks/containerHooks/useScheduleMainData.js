import { useQuery } from 'react-query';
import { useQueryConfig } from './shared';
import { getScheduleAndData } from '../../apis';

const useScheduleMainData = (scheduleId) => {
  const { isLoading: isScheduleLoading, data: schedule } = useQuery(
    ['schedules'],
    () => getScheduleAndData(scheduleId),
    useQueryConfig,
  );

  const returnData = {
    schedule: isScheduleLoading ? undefined : schedule.data,
  };

  return [isScheduleLoading, returnData.schedule];
};

export default useScheduleMainData;
