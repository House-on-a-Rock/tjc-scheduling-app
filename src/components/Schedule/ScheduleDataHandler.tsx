import React from 'react';
import { useQuery, useMutation, useQueryCache } from 'react-query';
import { getTabData } from '../../query/schedules';
import { postSchedule, destroySchedule } from '../../query/apis/schedules';

interface ScheduleDataHandlerProps {
  children: React.ReactElement<any>;
  churchId: number;
}

export const ScheduleDataHandler: React.FC<ScheduleDataHandlerProps> = ({
  children,
  churchId,
}) => {
  const cache = useQueryCache();
  const schedules = useQuery(['scheduleTabs', churchId], getTabData, {
    enabled: churchId,
    refetchOnWindowFocus: false,
    staleTime: 100000000000000,
  });
  const [addSchedule, addScheduleError] = useMutation(postSchedule, {
    onSuccess: (response) => {
      cache.invalidateQueries('scheduleTabs');
      //   closeDialogHandler(response);
    },
  });

  const deleteScheduleMutation = useMutation(destroySchedule, {
    onSuccess: (response) => {
      console.log(response);
      cache.invalidateQueries('scheduleTabs');
    },
  });

  return (
    <>
      {React.cloneElement(children, {
        schedules,
        addSchedule,
        addScheduleError,
        // destroySchedule: deleteScheduleMutation,
      })}
    </>
  );
};
