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
    { ...useQueryConfig },
  );

  const updateSchedule = useMutation(updateScheduleAssignments, {
    onSuccess: (res) => {
      // this pattern doesnt work because db isn't returning updated data idk why
      // console.log(`res.data`, res.data.data.services[0].events);
      // queryClient.setQueryData(`schedules_${scheduleId}`, res.data);

      queryClient.invalidateQueries(`schedules_${scheduleId}`);
      setIsScheduleModified(false);
      setAlert(sendAlert({ status: res.status, message: res.data.message }));
    },
    onError: (err) => {
      setAlert(sendAlert(err.response.data));
    }, // should anything else happen on error?
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
