import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { getChurchMembersData, getAllSchedules, getScheduleData } from '../../query';
import { ScheduleContainer } from './ScheduleContainer';

interface ScheduleProps {
  churchId: number;
}

export const Schedule = ({ churchId }: ScheduleProps) => {
  const [fetchedSchedules, setFetchedSchedules] = useState<number[]>([]);

  // There are some undefined queries in here -- not sure what you're talking about
  const tabs = useQuery(['tabs', churchId], () => getAllSchedules(churchId), {
    enabled: !!churchId,
    refetchOnWindowFocus: false,
    staleTime: 100000000000000,
    onSuccess: (data) => setFetchedSchedules(makeScheduleIdxs(data)),
  });

  const schedules = useQuery(
    ['schedules', fetchedSchedules],
    () => getScheduleData(makeScheduleIdxs(tabs.data)),
    {
      enabled: !!tabs.data,
      refetchOnWindowFocus: false,
      staleTime: 100000000000000,
      keepPreviousData: true, // why is this true?
    },
  );

  const users = useQuery(['users', churchId], () => getChurchMembersData(churchId), {
    enabled: !!churchId,
    staleTime: 300000,
    cacheTime: 3000000,
  });

  // only renders schedule once data is loaded. prevents excessive multiple re-rendering of the schedule itself
  if (!users.data) return <div>Loading</div>;

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

// is this dead?
// function fetchSchedule(tabIdx) {
//   if (tabIdx < tabs.data.length) {
//     setFetchedSchedule(tabIdx);
//     console.log(tabIdx, 'hello there');
//   }
// }
