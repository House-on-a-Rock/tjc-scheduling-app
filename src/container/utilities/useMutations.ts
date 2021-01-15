import { AxiosResponse, AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import {
  DeleteScheduleData,
  NewScheduleData,
  NewServiceData,
  DeleteEventsData,
  UserRoleData,
} from '../../shared/types';
import {
  postSchedule,
  destroySchedule,
  postService,
  destroyEvent,
  postUserRole,
  deleteUserRole,
} from '../../query/apis';

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

export const useCreateUserRole = () => {
  return useMutation<AxiosResponse<any>, AxiosError, UserRoleData, unknown>(postUserRole);
};

export const useDeleteUserRole = () => {
  return useMutation<AxiosResponse<any>, AxiosError, UserRoleData, unknown>(
    deleteUserRole,
  );
};
