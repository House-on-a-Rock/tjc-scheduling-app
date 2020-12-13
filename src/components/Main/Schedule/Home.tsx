import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useQuery, useMutation, useQueryCache } from 'react-query';
import { Dialog } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';

import { Scheduler } from './Scheduler';
import { ScheduleTabs } from './ScheduleTabs';
import { NewScheduleForm } from './NewScheduleForm';
import { NewServiceForm } from './NewServiceForm';

import { logout } from '../../../store/actions';
import { useSelector } from '../../../shared/utilities';
import { getScheduleData } from '../../../query/schedules';
import { addSchedule, addService } from '../../../store/apis/schedules';

import { buttonTheme } from '../../../shared/styles/theme.js';
import { showLoadingSpinner } from '../../../shared/styles/loading-spinner';

import history from '../../../history';

const useStyles = makeStyles(() =>
  createStyles({
    logoutButton: {
      position: 'fixed',
      zIndex: 9002,
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

export const Home = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  // React-query
  const cache = useQueryCache();
  const { churchId, name: churchName } = useSelector((state) => state.profile);
  const { isLoading, error, data = [] } = useQuery(
    ['schedulesData', churchId],
    getScheduleData,
    {
      enabled: churchId,
      refetchOnWindowFocus: false,
      staleTime: 100000000000000,
    },
  );

  showLoadingSpinner(isLoading);

  const [mutateAddSchedule] = useMutation(addSchedule, {
    onSuccess: () => cache.invalidateQueries('schedulesData'),
  });
  const [mutateAddService] = useMutation(addService, {
    onSuccess: () => cache.invalidateQueries('schedulesData'),
  });

  // Component state
  const [tabIdx, setTabIdx] = useState(0);
  const [displayedSchedule, setDisplayedSchedule] = useState(data[tabIdx]);
  const [isAddScheduleVisible, setIsAddScheduleVisible] = useState(false);
  const [isAddServiceVisible, setIsAddServiceVisible] = useState(false);

  function onTabClick(e: React.ChangeEvent<{}>, value: number) {
    if (value <= data.length - 1) {
      // if not the last tab, display that tab
      setTabIdx(value);
      setDisplayedSchedule(data[tabIdx]?.services);
    } else setIsAddScheduleVisible(true); // if last tab, open dialog to make new schedule
  }

  useEffect(() => {
    setDisplayedSchedule(data[tabIdx]?.services);
  }, [data, tabIdx]);

  async function onNewScheduleSubmit(
    scheduleTitle: string,
    startDate: string,
    endDate: string,
    view: string,
    team: number,
  ) {
    // validations needed
    setIsAddScheduleVisible(false);
    if (churchId)
      await mutateAddSchedule({
        scheduleTitle,
        startDate,
        endDate,
        view,
        team,
        churchId,
      });
    // display error messages if needed
  }

  async function onNewServiceSubmit(name: string, order: number, dayOfWeek: number) {
    // validations
    setIsAddServiceVisible(false);
    const response = await mutateAddService({
      name,
      order,
      dayOfWeek,
      scheduleId: tabIdx + 1, // since these aren't 0 based, need to add 1
    });
    // need an error/alert reporting system
  }

  const closeDialogHandler = () => {
    setIsAddScheduleVisible(false);
    setIsAddServiceVisible(false);
  };
  const onAddServiceClick = () => setIsAddServiceVisible(true);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          localStorage.removeItem('access_token');
          dispatch(logout());
          history.push('/auth/login');
        }}
        className={classes.logoutButton}
      >
        Log Out
      </button>
      <Dialog open={isAddScheduleVisible} onClose={closeDialogHandler}>
        <NewScheduleForm onSubmit={onNewScheduleSubmit} onClose={closeDialogHandler} />
      </Dialog>
      <Dialog open={isAddServiceVisible} onClose={closeDialogHandler}>
        <NewServiceForm
          order={displayedSchedule?.length || 0}
          onSubmit={onNewServiceSubmit}
          onClose={closeDialogHandler}
        />
      </Dialog>
      <ScheduleTabs
        tabIdx={tabIdx}
        onTabClick={onTabClick}
        titles={data.map((schedule: any) => schedule.title)}
      />
      <div className={classes.schedulesContainer}>
        <button type="button" onClick={onAddServiceClick}>
          <AddIcon height={50} width={50} /> Add New Service
        </button>
        {displayedSchedule?.map((schedule: any, idx: any) => (
          <Scheduler schedule={schedule} key={idx} />
        ))}
      </div>
    </>
  );
};
