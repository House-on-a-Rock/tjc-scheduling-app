import React, { useState } from 'react';
import { useQuery } from 'react-query';
import {
  getChurchMembersData,
  getAllSchedules,
  getScheduleData,
  getTeamsData,
} from '../../query';
import { ScheduleContainer } from './ScheduleContainer';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { loadingTheme } from '../../shared/styles/theme';

interface ScheduleProps {
  churchId: number;
}

export const Schedule = ({ churchId }: ScheduleProps) => {
  const classes = useStyles();
  const [fetchedSchedules, setFetchedSchedules] = useState<number[]>([]);

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
      keepPreviousData: true,
    },
  );

  const users = useQuery(['users', churchId], () => getChurchMembersData(churchId), {
    enabled: !!churchId,
    staleTime: 300000,
    cacheTime: 3000000,
  });

  const teams = useQuery(['teams', churchId], () => getTeamsData(churchId), {
    enabled: !!churchId,
    staleTime: 300000,
    cacheTime: 3000000,
  });

  return (
    <div
      className={
        !users.data || !tabs.data || !schedules.data || !teams.data ? classes.loading : ''
      }
    >
      {users.data && (
        <ScheduleContainer
          tabs={tabs.data}
          data={{
            schedules: schedules.data,
            users: users.data,
            churchId,
            teams: teams.data,
          }}
        />
      )}
    </div>
  );
};

function makeScheduleIdxs(tabsData) {
  const scheduleIdxs = [];
  for (let i = 0; i < tabsData.length && i < 3; i++) {
    scheduleIdxs.push(tabsData[i].id);
  }
  return scheduleIdxs;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    loading: {
      ...loadingTheme,
    },
  }),
);
