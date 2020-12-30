import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getAllSchedules, getScheduleData } from '../../query/schedules';
import { postSchedule, destroySchedule, postService } from '../../query/apis';
import { getChurchMembersData } from '../../query';
import { DeleteScheduleProps, NewScheduleData, NewServiceData } from '../../shared/types';

interface ScheduleDataHandlerProps {
  children: React.ReactElement<any>;
  churchId: number;
}

export const ScheduleDataHandler: React.FC<ScheduleDataHandlerProps> = ({
  children,
  churchId,
}) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>();
  const [error, setError] = useState(null);
  const [fetchedSchedules, setFetchedSchedules] = useState<number[]>([]);
  // testing this out for mutation success
  const [isSuccess, setIsSuccess] = useState<string>();

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
  const createSchedule = useMutation(postSchedule, {
    onSuccess: () => {
      queryClient.invalidateQueries('tabs');
      queryClient.invalidateQueries('schedules');
      setIsSuccess('NewScheduleForm');
    },
    onError: (result: any) => {
      setError({
        status: result.response.status,
        message: result.response.statusText,
      });
    },
  });
  const deleteSchedule = useMutation(destroySchedule, {
    onSuccess: () => {
      queryClient.invalidateQueries('tabs');
      setIsSuccess('DeleteSchedule');
      // BUG: part 1: deleting incorrectly is successful; part 2: rerenders component
    },
    onError: (result: any) => {
      setError({
        status: result.response.status,
        message: result.response.statusText,
      });
    },
  });

  const createService = useMutation(postService, {
    onSuccess: (response) => {
      queryClient.invalidateQueries('schedules');
      setIsSuccess('NewServiceForm');
    },
    onError: (result: any) => {
      setError({
        status: result.response.status,
        message: result.response.statusText,
      });
    },
  });

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

  return (
    <>
      {React.cloneElement(children, {
        tabs: tabs.data,
        state: { data, isLoading, error, isSuccess },
        addSchedule: (newInfo: NewScheduleData) =>
          createSchedule.mutate({ ...newInfo, churchId }),
        removeSchedule: (info: DeleteScheduleProps) => deleteSchedule.mutate(info),
        addService: (newInfo: NewServiceData) => {
          console.log(newInfo);
          createService.mutate(newInfo);
        },
        // fetchSchedule,
      })}
    </>
  );
};

function makeScheduleIdxs(tabsData) {
  const scheduleIdxs = [];
  for (let i = 0; i < tabsData.length && i < 3; i++) {
    scheduleIdxs.push(tabsData[i].id);
  }
  return scheduleIdxs;
}
