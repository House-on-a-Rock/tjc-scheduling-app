import React, { useState } from 'react';
import { useQuery, useMutation, useQueryCache } from 'react-query';
import { Dialog, Button } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import { getTabData } from '../../query/schedules';
import { postSchedule, destroySchedule } from '../../query/apis/schedules';

import { ScheduleTabs } from './ScheduleTabs';
import { NewScheduleForm } from './NewScheduleForm';
import { ScheduleComponent } from './ScheduleComponent';
import { Alert } from '../shared/Alert';
import { AlertInterface } from '../../shared/types';
import { buttonTheme } from '../../shared/styles/theme';
import { NewServiceForm } from './NewServiceForm';

interface ScheduleContainerProps {
  churchId: number;
}

export const ScheduleContainer = ({ churchId }: ScheduleContainerProps) => {
  const classes = useStyles();
  const cache = useQueryCache();

  const { isLoading, error, data, refetch } = useQuery(
    ['scheduleTabs', churchId],
    getTabData,
    {
      enabled: churchId,
      refetchOnWindowFocus: false,
      staleTime: 100000000000000,
    },
  );
  const [mutateAddSchedule, { error: mutateScheduleError }] = useMutation(postSchedule, {
    onSuccess: (response) => {
      cache.invalidateQueries('scheduleTabs');
      closeDialogHandler(response);
    },
  });

  const [mutateDeleteSchedule, { error: deleteScheduleError }] = useMutation(
    destroySchedule,
    {
      onSuccess: (response) => {
        console.log(response);
        cache.invalidateQueries('scheduleTabs');
      },
    },
  );

  // state
  const [tabIdx, setTabIdx] = useState(0);
  const [isNewScheduleVisible, setIsNewScheduleVisible] = useState<boolean>(false);
  const [openedTabs, setOpenedTabs] = useState<number[]>([0]);
  const [alert, setAlert] = useState<AlertInterface>();
  const [isAddServiceVisible, setIsAddServiceVisible] = useState<boolean>(false);

  function onTabClick(value: number) {
    if (value <= data.length - 1) {
      // if not the last tab, open that tab
      setTabIdx(value);
      const isOpened = openedTabs.indexOf(value);
      if (isOpened < 0) setOpenedTabs([...openedTabs, value]); // adds unopened tabs to array. need way to handle lots of tabs
    } else setIsNewScheduleVisible(true); // if last tab, open dialog to make new schedule
  }

  function closeDialogHandler(response?: any) {
    // TODO for some reason theres a lot of rerenders for just this alert. nothing visible to client, very low priority
    setIsNewScheduleVisible(false);
    if (response?.data) setAlert({ message: response.data, status: 'success' }); // response.statusText = "OK", response.status == 200
  }

  async function onNewScheduleSubmit(
    scheduleTitle: string,
    startDate: string,
    endDate: string,
    view: string,
    team: number,
  ) {
    await mutateAddSchedule({
      scheduleTitle,
      startDate,
      endDate,
      view,
      team,
      churchId,
    });
  }

  async function onScheduleDelete(scheduleId: string, title: string) {
    await mutateDeleteSchedule({ scheduleId, title });
  }

  return (
    <>
      <Button
        onClick={() => {
          setOpenedTabs([0]);
          onScheduleDelete(data[tabIdx].id, data[tabIdx].title);
        }}
        className={classes.deleteButton}
      >
        DELETE SCHEDULE
      </Button>
      <Dialog open={isNewScheduleVisible} onClose={() => closeDialogHandler()}>
        <NewScheduleForm
          onClose={() => closeDialogHandler()}
          error={mutateScheduleError}
          onSubmit={onNewScheduleSubmit}
        />
      </Dialog>
      {alert && <Alert alert={alert} unMountAlert={() => setAlert(null)} />}
      {data && data.length > 0 && (
        <div>
          <ScheduleTabs
            tabIdx={tabIdx}
            onTabClick={onTabClick}
            titles={data.map((schedule: any) => schedule.title)}
          />
          {openedTabs.map((tab) => (
            <>
              <ScheduleComponent
                churchId={churchId}
                setAlert={setAlert}
                scheduleId={data[tab].id}
                isViewed={tab === tabIdx}
                key={tab.toString()}
              />
              {/* <NewServiceForm
                error={mutateAddServiceError}
                order={data.services?.length || 0}
                onSubmit={onNewServiceSubmit}
                onClose={closeDialogHandler}
              /> */}
            </>
          ))}
        </div>
      )}
    </>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    schedulesContainer: {
      position: 'absolute',
      paddingTop: 10,
    },
    deleteButton: {
      padding: '10px',
      borderRadius: '5px',
      border: 'none',
      '&:hover, &:focus': {
        ...buttonTheme.filled,
      },
    },
  }),
);
