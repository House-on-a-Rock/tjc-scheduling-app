import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
// react query
import { useQuery, useMutation, useQueryCache } from 'react-query';

import { Dialog, Button } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { getTabData } from '../../../query/schedules';
import { addSchedule } from '../../../store/apis/schedules';

import { ScheduleTabs } from './ScheduleTabs';
import { NewScheduleForm } from './NewScheduleForm';
import { ScheduleContainer } from './ScheduleContainer';
import { Alert } from '../../shared/Alert';
import { logout } from '../../../store/actions';
import { useSelector } from '../../../shared/utilities';
import { buttonTheme } from '../../../shared/styles/theme.js';

import { AlertInterface } from '../../../shared/types';

export const Home = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const cache = useQueryCache();

  // queries
  const { churchId, name: churchName } = useSelector((state) => state.profile);
  const { isLoading, error, data } = useQuery(['scheduleTabs', churchId], getTabData, {
    enabled: churchId,
    refetchOnWindowFocus: false,
    staleTime: 100000000000000,
  });
  const [mutateAddSchedule, { error: mutateScheduleError }] = useMutation(addSchedule, {
    onSuccess: (response) => {
      cache.invalidateQueries('scheduleTabs');
      closeDialogHandler(response);
    },
  });

  // state
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

  return (
    <>
      <Button
        onClick={() => {
          localStorage.removeItem('access_token');
          dispatch(logout());
        }}
        className={classes.logoutButton}
      >
        Log Out
      </Button>
      <Dialog open={isNewScheduleVisible} onClose={() => closeDialogHandler()}>
        <NewScheduleForm
          onClose={() => closeDialogHandler()}
          error={mutateScheduleError}
          onSubmit={onNewScheduleSubmit}
        />
      </Dialog>
      {alert && <Alert alert={alert} unMountAlert={() => setAlert(null)} />}
      {data && (
        <div>
          <ScheduleTabs
            tabIdx={tabIdx}
            onTabClick={onTabClick}
            titles={data.map((schedule: any) => schedule.title)}
          />
          {openedTabs.map((tab) => (
            <ScheduleContainer
              churchId={churchId}
              setAlert={setAlert}
              scheduleId={data[tab].id}
              isViewed={tab === tabIdx}
              key={tab.toString()}
            />
          ))}
        </div>
      )}
    </>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    logoutButton: {
      position: 'fixed',
      zIndex: 200,
      padding: '10px',
      borderRadius: '5px',
      border: 'none',
      '&:hover, &:focus': {
        ...buttonTheme.filled,
      },
    },
    schedulesContainer: {
      position: 'absolute',
      paddingTop: 10,
    },
  }),
);
