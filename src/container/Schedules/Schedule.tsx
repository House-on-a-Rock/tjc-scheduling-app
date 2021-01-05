import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { getChurchMembersData, getAllSchedules, getScheduleData } from '../../query';
import { ScheduleContainer } from './ScheduleContainer';

interface ScheduleProps {
  churchId: number;
}

export const Schedule = ({ churchId }: ScheduleProps) => {
  const [fetchedSchedules, setFetchedSchedules] = useState<number[]>([]);

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

  // Will need to add availabilities (or unavailabilities)
  const users = useQuery(['users', churchId], () => getChurchMembersData(churchId), {
    enabled: !!churchId,
    staleTime: 300000,
    cacheTime: 3000000,
  });

  useEffect(() => {
    if (tabs.data) {
      // handles created or deleted schedules
      setFetchedSchedules(makeScheduleIdxs(tabs.data));
    }
  }, [tabs]);

  // is this dead?
  // function fetchSchedule(tabIdx) {
  //   if (tabIdx < tabs.data.length) {
  //     setFetchedSchedule(tabIdx);
  //     console.log(tabIdx, 'hello there');
  //   }
  // }

  return (
    <ScheduleContainer
      tabs={tabs.data}
      data={{ schedules: schedules.data, users: users.data, churchId }}
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
