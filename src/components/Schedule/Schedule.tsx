import React, { useState } from 'react';
import {
  useQuery,
  useMutation,
  useQueryCache,
  QueryResult,
  MutateFunction,
  MutationResult,
} from 'react-query';
import { AxiosResponse } from 'axios';
import { NewScheduleData } from '../../shared/types';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ScheduleProps {
  schedules?: QueryResult<any, unknown>;
  addSchedule?: MutateFunction<AxiosResponse<any>, unknown, NewScheduleData, unknown>;
  addScheduleError?: MutationResult<AxiosResponse<any>, unknown>;
}

// eslint-disable-next-line no-empty-pattern
export const Schedule = ({ schedules, addSchedule, addScheduleError }: ScheduleProps) => {
  const { isLoading, error, data, refetch } = schedules;

  function postSchedule() {
    addSchedule({
      scheduleTitle: 'Try a new schedule',
      startDate: '09/15/2020',
      endDate: '12/15/2020',
      view: 'weekly',
      team: 2,
      churchId: 2,
    });
  }

  return (
    <>
      Schedule
      {isLoading}
      {error}
      {!isLoading ? JSON.stringify(data) : 'loadingj'}
      <button type="button" onClick={() => postSchedule()}>
        Create a new schedule
      </button>
      {JSON.stringify(addScheduleError)}
    </>
  );
};

// const useStyles = makeStyles((theme: Theme) =>
//   createStyles({
//     // schedulesContainer: {
//     //   position: 'absolute',
//     //   paddingTop: 10,
//     // },
//     // deleteButton: {
//     //   padding: '10px',
//     //   borderRadius: '5px',
//     //   border: 'none',
//     //   '&:hover, &:focus': {
//     //     ...buttonTheme.filled,
//     //   },
//     // },
//   }),
// );
