import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryCache } from 'react-query';

// Material UI Components
import { Prompt } from 'react-router-dom';
import { Dialog, Button } from '@material-ui/core/';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';

// Custom Components
import { NewServiceForm } from './NewServiceForm';
import { Table } from './Table';
import { showLoadingSpinner } from '../../../shared/styles/loading-spinner';

// Utilities
import { addService, updateScheduleAssignments } from '../../../store/apis/schedules';
import { AlertInterface } from '../../../shared/types';
import { buttonTheme } from '../../../shared/styles/theme.js';
import { getScheduleData } from '../../../query/schedules';

interface ScheduleContainerProps {
  scheduleId: number;
  isViewed: boolean;
  setAlert: (arg: AlertInterface) => void;
  churchId: number;
}

// makes api calls, distributes data to scheduler
export const ScheduleContainer = ({
  scheduleId,
  isViewed,
  setAlert,
  churchId,
}: ScheduleContainerProps) => {
  const classes = useStyles();
  const cache = useQueryCache();

  // queries
  const { isLoading, error, data } = useQuery(
    ['scheduleData', scheduleId],
    getScheduleData,
    {
      staleTime: 100000000000000,
    },
  );

  // mutations
  const [mutateAddService, { error: mutateAddServiceError }] = useMutation(addService, {
    onSuccess: (response) => {
      cache.invalidateQueries('scheduleData');
      closeDialogHandler(response);
    },
  });
  const [mutateUpdateSchedule, { error: mutateUpdateScheduleError }] = useMutation(
    updateScheduleAssignments,
    {
      onSuccess: (response) => {
        cache.invalidateQueries('scheduleData');
        setAlert({ message: response[0].data, status: 'success' });
      },
    },
  );

  // state
  const [isAddServiceVisible, setIsAddServiceVisible] = useState<boolean>(false);
  const [isScheduleModified, setIsScheduleModified] = useState<boolean>(false);
  const changedTasks = useRef<any>({});

  showLoadingSpinner(isLoading);

  return (
    <div
      className={classes.scheduleContainer}
      style={{ display: isViewed ? 'block' : 'none' }}
    >
      <Button disabled={!isScheduleModified} onClick={() => onSaveScheduleChanges()}>
        Save Changes
      </Button>
      <Prompt
        when={isScheduleModified}
        message="You have unsaved changes, are you sure you want to leave? Unsaved changes will be lost"
      />
      {data && (
        <Dialog open={isAddServiceVisible} onClose={closeDialogHandler}>
          <NewServiceForm
            error={mutateAddServiceError}
            order={data.services?.length || 0}
            onSubmit={onNewServiceSubmit}
            onClose={closeDialogHandler}
          />
        </Dialog>
      )}
      {data && (
        <div>
          <Table data={data} access="write" onTaskModified={onTaskModified} />
        </div>
      )}
      <div className={classes.bottomButtonContainer}>
        <Button onClick={onAddServiceClick} className={classes.addNewServiceButton}>
          <AddIcon height={50} width={50} />
          <span>Add New Service</span>
        </Button>
      </div>
    </div>
  );

  function closeDialogHandler(response: any) {
    setIsAddServiceVisible(false);
    if (response.data) setAlert({ message: response.data, status: 'success' });
  }

  function onAddServiceClick() {
    setIsAddServiceVisible(true);
  }

  function onTaskModified(taskId: number, newAssignee: number, isChanged: boolean) {
    if (isChanged) {
      const updatedChangedTasks = { ...changedTasks.current, [taskId]: newAssignee };
      changedTasks.current = updatedChangedTasks;
    } else if (changedTasks.current[taskId]) delete changedTasks.current[taskId];

    setIsScheduleModified(Object.keys(changedTasks.current).length > 0);
  }

  async function onNewServiceSubmit(name: string, order: number, dayOfWeek: number) {
    await mutateAddService({
      name,
      order: order,
      dayOfWeek,
      scheduleId: scheduleId,
    });
    // cleanup
    setIsScheduleModified(false);
  }

  async function onSaveScheduleChanges() {
    await mutateUpdateSchedule(changedTasks.current);
    setIsScheduleModified(false);
  }
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    scheduleContainer: {
      position: 'absolute',
      paddingTop: 10,
    },
    bottomButtonContainer: {
      position: 'sticky',
      left: 0,
      display: 'flex',
      width: '100vw',
      justifyContent: 'center',
      paddingBottom: '2rem',
    },
    addNewServiceButton: {
      position: 'sticky',
      padding: '10px',
      borderRadius: '5px',
      border: 'none',
      '&:hover, &:focus': {
        ...buttonTheme.filled,
      },
      display: 'flex',
      '& *': {
        margin: 'auto',
      },
    },
  }),
);
