import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { AxiosResponse, AxiosError } from 'axios';
// the queries aren't very consistent....
import {
  postSchedule,
  destroySchedule,
  postService,
  destroyEvent,
} from '../../query/apis';
import { getChurchMembersData, getAllSchedules, getScheduleData } from '../../query';
import {
  DeleteScheduleData,
  NewScheduleData,
  NewServiceData,
  DeleteEventsData,
} from '../../shared/types';
import { ScheduleContainer } from './ScheduleContainer';

interface ScheduleProps {
  churchId: number;
}

export const Schedule = ({ churchId }: ScheduleProps) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>();
  const [error, setError] = useState(null);
  const [fetchedSchedules, setFetchedSchedules] = useState<number[]>([]);
  const [isSuccess, setIsSuccess] = useState<string>('');

  // Gets all schedules' id
  // There are some undefined queries in here
  const tabs = useQuery(['tabs', churchId], () => getAllSchedules(churchId), {
    enabled: !!churchId,
    refetchOnWindowFocus: false,
    staleTime: 100000000000000,
  });

  const schedules = useQuery(
    ['schedules', fetchedSchedules],
    () =>
      getScheduleData(
        fetchedSchedules.length > 0 ? makeScheduleIdxs(tabs.data) : fetchedSchedules,
      ),
    {
      enabled: !!tabs.data,
      refetchOnWindowFocus: false,
      staleTime: 100000000000000,
      keepPreviousData: true,
    },
  );

  // Users with their teammates (for autocomplete)
  // Will need to add availabilities (or unavailabilities)
  const users = useQuery(['roleData', churchId], () => getChurchMembersData(churchId), {
    enabled: !!churchId,
    staleTime: 300000,
    cacheTime: 3000000,
  });

  // CRUD Mutations
  const createSchedule = useMutation<
    AxiosResponse<any>,
    AxiosError,
    NewScheduleData,
    unknown
  >(postSchedule, {
    onSuccess: () => {
      queryClient.invalidateQueries('tabs');
      queryClient.invalidateQueries('schedules');
      setIsSuccess('NewScheduleForm');
    },
    onError: (result) => errorHandling(result, setError),
    onSettled: () => setIsSuccess(''),
  });

  const deleteSchedule = useMutation<
    AxiosResponse<any>,
    AxiosError,
    DeleteScheduleData,
    unknown
  >(destroySchedule, {
    onSuccess: () => {
      queryClient.invalidateQueries('tabs');
      setIsSuccess('DeleteSchedule');
      // BUG: part 1: deleting incorrectly is successful; part 2: rerenders component
    },
    onError: (result) => errorHandling(result, setError),
    onSettled: () => setIsSuccess(''),
  });

  const createService = useMutation<
    AxiosResponse<any>,
    AxiosError,
    NewServiceData,
    unknown
  >(postService, {
    onSuccess: () => {
      queryClient.invalidateQueries('schedules');
      setIsSuccess('NewServiceForm');
    },
    onError: (result) => errorHandling(result, setError),
    onSettled: () => setIsSuccess(''),
  });

  const deleteEvent = useMutation<AxiosResponse<any>, AxiosError, string, unknown>(
    destroyEvent,
    {
      onSuccess: () => {
        setIsSuccess('DeleteEvents');
        queryClient.invalidateQueries('schedules');
        // BUG: part 1: deleting incorrectly is successful; part 2: rerenders component
      },
      onError: (result) => errorHandling(result, setError),
      onSettled: () => setIsSuccess(''),
    },
  );

  useEffect(() => {
    if (tabs.data) {
      // handles created or deleted schedules
      setFetchedSchedules(makeScheduleIdxs(tabs.data));
    }
  }, [tabs]);

  // function fetchSchedule(tabIdx) {
  //   if (tabIdx < tabs.data.length) {
  //     setFetchedSchedule(tabIdx);
  //     console.log(tabIdx, 'hello there');
  //   }
  // }

  useEffect(() => {
    if (schedules.isSuccess) setError(null);
    if (schedules.isError) setError(schedules.error);
    if (schedules.data) setData({ ...data, schedules: schedules.data });
    if (schedules.isLoading !== isLoading) setIsLoading(schedules.isLoading);
  }, [schedules]);

  useEffect(() => {
    if (users.isSuccess) setError(null);
    if (users.isError) setError(users.error);
    if (users.data) setData({ ...data, users: users.data });
    if (users.isLoading !== isLoading) setIsLoading(users.isLoading);
  }, [users]);

  useEffect(() => {
    if (deleteEvent.isLoading) setIsLoading(deleteEvent.isLoading);
    // uncomment above for an example that shows setIsLoading works
    // Task item, decide and implement loading logic
    // we'll have to decide whether we want the loading logic to be separated into different parts of the table body or to have it just cover the whole screen
  }, [deleteEvent]);

  return (
    <ScheduleContainer
      tabs={tabs.data}
      state={{ data, isLoading, error, isSuccess }}
      addSchedule={(newInfo: NewScheduleData) =>
        createSchedule.mutate({ ...newInfo, churchId })
      }
      removeSchedule={(info: DeleteScheduleData) => deleteSchedule.mutate(info)}
      addService={(newInfo: NewServiceData) => createService.mutate(newInfo)}
      removeEvents={({ eventIds }: DeleteEventsData) =>
        eventIds.map((eventId) => deleteEvent.mutate(eventId))
      }
    />
  );
};

function makeScheduleIdxs(tabsData) {
  const scheduleIdxs = [];
  for (let i = 0; i < tabsData.length && i < 3; i++) {
    scheduleIdxs.push(tabsData[i].id);
  }
  return scheduleIdxs;
}

function errorHandling(result: AxiosError, setError) {
  setError({
    status: result.response.status,
    message: result.response.statusText,
  });
}
