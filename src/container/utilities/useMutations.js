import { useMutation, useQueryClient } from 'react-query';
import {
  postSchedule,
  destroySchedule,
  postService,
  destroyEvent,
} from '../../query/apis';

export const useCreateSchedule = (setDialogOpen) => {
  const queryClient = useQueryClient();
  return useMutation(postSchedule, {
    onSuccess: () => {
      queryClient.invalidateQueries('tabs');
      queryClient.invalidateQueries('schedules');
      setDialogOpen(false);
    },
  });
};

export const useDeleteSchedule = (setWarning) => {
  const queryClient = useQueryClient();
  return useMutation(destroySchedule, {
    onSuccess: () => {
      queryClient.invalidateQueries('tabs');
      setWarning('');
    },
  });
};

export const useCreateService = (setDialogOpen) => {
  const queryClient = useQueryClient();
  return useMutation(postService, {
    onSuccess: () => {
      queryClient.invalidateQueries('schedules');
      setDialogOpen(false);
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation(destroyEvent, {
    onSuccess: () => {
      queryClient.invalidateQueries('schedules');
    },
  });
};
