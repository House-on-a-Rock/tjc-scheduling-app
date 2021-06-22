import PropTypes from 'prop-types';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { useQueryConfig } from './shared';
import {
  getScheduleAndData,
  updateScheduleAssignments,
  createTemplate,
} from '../../apis';

import { useHistory } from 'react-router-dom';

const useScheduleMainData = (
  scheduleId,
  setIsScheduleModified,
  setAlert,
  setIsTemplateFormOpen,
) => {
  const queryClient = useQueryClient();
  const history = useHistory();
  const { isLoading: isScheduleLoading, data: schedule } = useQuery(
    [`schedules_${scheduleId}`],
    () => getScheduleAndData(scheduleId),
    { ...useQueryConfig },
  );

  const updateSchedule = useMutation(updateScheduleAssignments, {
    onSuccess: (res) => {
      // this pattern doesnt work because db isn't returning updated data idk why
      // but it would cut down on a network call and a rerender sooo TODO figure out whyyy
      // other useMutations work with this pattern, will try to use it for all useMutations

      // console.log(`res.data`, res.data.data.services[0].events);
      // queryClient.setQueryData(`schedules_${scheduleId}`, { ...res.data });
      queryClient.invalidateQueries(`schedules_${scheduleId}`);
      setIsScheduleModified(false);
      setAlert(res);
    },
    onError: (err) => {
      // errors will come back in form of err.response.data = { message, status }
      setAlert(err);
    }, // should anything else happen on error?
    // TODO on error, do we stay in edit mode? what should behavior be.
    // OR we leave this undone and hope we never run into it lol
  });

  // create template
  const createNewTemplate = useMutation(createTemplate, {
    onSuccess: (res) => {
      queryClient.setQueryData('templates', res.data);
      setIsTemplateFormOpen(false);
      setAlert(res);
      history.push(`/templates`);
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
