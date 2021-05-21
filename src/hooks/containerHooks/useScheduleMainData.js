import PropTypes from 'prop-types';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { useQueryConfig } from './shared';
import {
  getScheduleAndData,
  updateScheduleAssignments,
  createTemplate,
} from '../../apis';
import { createAlert } from '../../components/shared/Alert';

const useScheduleMainData = (
  scheduleId,
  setIsScheduleModified,
  setAlert,
  setIsTemplateFormOpen,
) => {
  const queryClient = useQueryClient();
  const { isLoading: isScheduleLoading, data: schedule } = useQuery(
    [`schedules_${scheduleId}`],
    () => getScheduleAndData(scheduleId),
    { ...useQueryConfig },
  );

  const updateSchedule = useMutation(updateScheduleAssignments, {
    onSuccess: (res) => {
      // this pattern doesnt work because db isn't returning updated data idk why
      // but it would cut down on a network call and a rerender sooo
      // other useMutations work with this pattern, should try to use it for all useMutations
      // queryClient.setQueryData(response.data)

      // console.log(`res.data`, res.data.data.services[0].events);
      // queryClient.setQueryData(`schedules_${scheduleId}`, res.data);

      queryClient.invalidateQueries(`schedules_${scheduleId}`);
      setIsScheduleModified(false);
      setAlert(createAlert({ status: res.status, message: res.data.message }));
    },
    onError: (err) => {
      // errors will come back in form of err.response.data = { message, status }
      setAlert(createAlert(err.response.data));
    }, // should anything else happen on error?
    // TODO leave in edit mode? what should behavior be.
    // OR we leave this undone and hope we never run into it lol
  });

  // create template
  const createNewTemplate = useMutation(createTemplate, {
    onSuccess: (res) => {
      queryClient.setQueryData('templates', res.data);
      setIsTemplateFormOpen(false);
      setAlert(createAlert({ status: res.status, message: res.data.message }));
      // TODO navigate to templates tab?
    },
    onError: (err) => {
      console.log(`err.response`, err.response);
    },
  });

  const returnData = {
    schedule: isScheduleLoading ? null : schedule.data,
  };

  return [returnData.schedule, updateSchedule.mutate, createNewTemplate];
};

useScheduleMainData.propTypes = {
  scheduleId: PropTypes.number,
  setIsScheduleModified: PropTypes.func,
};

export default useScheduleMainData;
