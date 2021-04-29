import { useQuery, useQueryClient, useMutation } from 'react-query';
import { useQueryConfig } from './shared';
import {
  getScheduleAndData,
  updateScheduleAssignments,
  destroySchedule,
} from '../../apis';

const useScheduleMainData = (scheduleId) => {
  const queryClient = useQueryClient();
  const { isLoading: isScheduleLoading, data: schedule } = useQuery(
    ['schedules'],
    () => getScheduleAndData(scheduleId),
    {
      ...useQueryConfig,
      onSuccess: () => {
        // console.log('refetching schedule data');
      },
    },
  );

  const deleteSchedule = useMutation(destroySchedule, {
    onSuccess: () => {
      queryClient.invalidateQueries('tabs');
      // setWarning('');
    },
  });

  const updateSchedule = useMutation(updateScheduleAssignments, {
    onSuccess: () => {
      queryClient.invalidateQueries('schedules');
    },
  });

  const returnData = {
    schedule: isScheduleLoading ? null : schedule.data,
  };

  return [returnData.schedule, deleteSchedule, updateSchedule];
};

export default useScheduleMainData;
