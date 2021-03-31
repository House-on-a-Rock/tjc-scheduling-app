import { AxiosResponse, AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import {
  DeleteScheduleData,
  NewScheduleData,
  NewServiceData,
  DeleteEventsData,
} from '../../shared/types';
import {
  postSchedule,
  destroySchedule,
  postService,
  destroyEvent,
  updateScheduleAssignments,
} from '../../query/apis';
import { query } from 'express';

export const useCreateSchedule = (setDialogOpen) => {
  const queryClient = useQueryClient();
  return useMutation<AxiosResponse<any>, AxiosError, NewScheduleData>(postSchedule, {
    onSuccess: () => {
      queryClient.invalidateQueries('tabs');
      queryClient.invalidateQueries('schedules');
      setDialogOpen(false);
    },
  });
};

export const useDeleteSchedule = (setWarning) => {
  const queryClient = useQueryClient();
  return useMutation<AxiosResponse<any>, AxiosError, DeleteScheduleData, unknown>(
    destroySchedule,
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tabs');
        setWarning('');
      },
    },
  );
};

export const useCreateService = (setDialogOpen) => {
  const queryClient = useQueryClient();
  return useMutation<AxiosResponse<any>, AxiosError, NewServiceData, unknown>(
    postService,
    {
      onSuccess: () => {
        queryClient.invalidateQueries('schedules');
        setDialogOpen(false);
      },
    },
  );
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation<AxiosResponse<any>, AxiosError, string>(destroyEvent, {
    onSuccess: () => {
      queryClient.invalidateQueries('schedules');
    },
  });
};

export const useUpdateSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation<AxiosResponse<any>, AxiosError, any>(updateScheduleAssignments, {
    onSuccess: () => {
      queryClient.invalidateQueries('schedules');
    },
  });
};
