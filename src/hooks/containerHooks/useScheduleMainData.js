import PropTypes from 'prop-types';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { useQueryConfig } from './shared';
import { getScheduleAndData, updateScheduleAssignments } from '../../apis';
import { sendAlert } from '../../components/shared/Alert';

const useScheduleMainData = (scheduleId, setIsScheduleModified, setAlert) => {
  const queryClient = useQueryClient();
  const { isLoading: isScheduleLoading, data: schedule } = useQuery(
    [`schedules_${scheduleId}`],
    () => getScheduleAndData(scheduleId),
    {
      ...useQueryConfig,
      onSuccess: () => {
        // console.log('refetching schedule data');
      },
    },
  );

  const updateSchedule = useMutation(updateScheduleAssignments, {
    onSuccess: (res) => {
      queryClient.invalidateQueries(`schedules_${scheduleId}`);
      setIsScheduleModified(false);
      setAlert(sendAlert(res));
    },
    onError: (err) => {
      // console.log(`err`, err);
    }, // need error handling
  });

  const returnData = {
    schedule: isScheduleLoading ? null : schedule.data,
  };

  return [returnData.schedule, updateSchedule.mutate];
};

useScheduleMainData.propTypes = {
  scheduleId: PropTypes.number,
  setIsScheduleModified: PropTypes.func,
};

export default useScheduleMainData;
