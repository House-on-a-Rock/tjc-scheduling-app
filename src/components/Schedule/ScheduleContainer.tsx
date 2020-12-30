import React, { useState } from 'react';
import { useQuery, useMutation, useQueryCache } from 'react-query';
import { Dialog, Button } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import { getTabData } from '../../query/schedules';
import { addSchedule, deleteSchedule } from '../../query/apis/schedules';

import { ScheduleTabs } from './ScheduleTabs';
import { NewScheduleForm } from '../shared/NewScheduleForm';
import { ScheduleComponent } from './ScheduleComponent';
import { Alert } from '../shared/Alert';
import { ConfirmationDialog } from '../shared/ConfirmationDialog';
import { AlertInterface } from '../../shared/types';
import { buttonTheme } from '../../shared/styles/theme';

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
  const [mutateAddSchedule, { error: mutateScheduleError }] = useMutation(addSchedule, {
    onSuccess: (response) => {
      cache.invalidateQueries('scheduleTabs');
      closeDialogHandler(response);
    },
  });

  const [mutateDeleteSchedule, { error: deleteScheduleError }] = useMutation(
    deleteSchedule,
    {
      onSuccess: (response) => {
        cache.invalidateQueries('scheduleTabs');
        setAlert({ message: response.data, status: 'success' });
      },
    },
  );

  // state
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [tabIdx, setTabIdx] = useState(0);
  const [isNewScheduleVisible, setIsNewScheduleVisible] = useState<boolean>(false);
  const [openedTabs, setOpenedTabs] = useState<number[]>([0]);
  const [alert, setAlert] = useState<AlertInterface>();

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

  return (
    <>
      <Button
        onClick={() => setDeleteDialogOpen(!isDeleteDialogOpen)}
        className={classes.deleteButton}
      >
        DELETE SCHEDULE
      </Button>
      <Dialog open={isNewScheduleVisible} onClose={() => closeDialogHandler()}>
        <NewScheduleForm
          onClose={() => closeDialogHandler()}
          error={mutateScheduleError}
          onSubmit={mutateAddSchedule}
          churchId={churchId}
        />
      </Dialog>
      <ConfirmationDialog
        title="Are you sure you want to delete?"
        isOpen={isDeleteDialogOpen}
        handleClick={(clickedYes) => {
          setDeleteDialogOpen(!isDeleteDialogOpen);
          if (clickedYes) {
            setOpenedTabs([0]);
            mutateDeleteSchedule({
              scheduleId: data[tabIdx].id,
              title: data[tabIdx].title,
            });
          }
        }}
      />
      {alert && (
        <Alert alert={alert} isOpen={alert !== null} handleClose={() => setAlert(null)} />
      )}
      {data && (
        <div>
          <ScheduleTabs
            tabIdx={tabIdx}
            onTabClick={onTabClick}
            titles={data.map((schedule: any) => schedule.title)}
          />
          {data.length > 0
            ? openedTabs.map((tab) => (
                <ScheduleComponent
                  churchId={churchId}
                  setAlert={setAlert}
                  scheduleId={data[tab].id}
                  isViewed={tab === tabIdx}
                  key={tab.toString()}
                />
              ))
            : null}
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
      position: 'fixed',
      zIndex: 200,
      padding: '10px',
      borderRadius: '5px',
      border: 'none',
      '&:hover, &:focus': {
        ...buttonTheme.filled,
      },
    },
  }),
);
