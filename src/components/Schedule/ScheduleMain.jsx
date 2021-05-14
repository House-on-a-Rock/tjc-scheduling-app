// https://codesandbox.io/s/react-material-ui-and-react-beautiful-dnd-forked-bmheb?file=/src/MaterialTable.jsx draggable table
import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Prompt } from 'react-router';

import ld from 'lodash';
import { loadingTheme } from '../../shared/styles/theme';
import { createStyles, makeStyles } from '@material-ui/core';

import Table from './Table';
import Toolbar from './Toolbar';

import { processUpdate, createBlankService, formatData, cellStatus } from './utilities';
import { updatedDiff } from 'deep-object-diff';

import useScheduleMainData from '../../hooks/containerHooks/useScheduleMainData';
import CustomDialog from '../shared/CustomDialog';

// TODO prompt doesnt work...?!?!?!?

const ScheduleMain = ({
  churchId,
  scheduleId,
  isVisible,
  users,
  teams,
  setAlert,
  deleteSchedule,
  tab,
}) => {
  const classes = useStyles();
  const [isScheduleModified, setIsScheduleModified] = useState(false);
  const [dialogState, setDialogState] = useState({ isOpen: false, state: '' });

  const [isEditMode, setIsEditMode] = useState(false);
  const [dataModel, setDataModel] = useState();

  const [schedule, updateSchedule] = useScheduleMainData(
    scheduleId,
    setIsScheduleModified,
    setAlert,
  );

  const templateChanges = useRef({
    changesSeed: -1,
  });

  const CELLWARNING = 'CELLWARNING';
  const LEAVEPAGE = 'LEAVEPAGE';
  const DELETESCHEDULE = 'DELETESCHEDULE';

  const DialogConfig = {
    CELLWARNING: {
      title: 'There are improperly assigned cells',
      warningText:
        'Tasks marked with a red background are improperly assigned. You may save, but you will be unable to publish this schedule until those tasks are assigned properly',
      description: '',
      handleClose: resetDialog,
      handleSubmit: () => saveSchedule(),
    },
    DELETESCHEDULE: {
      title: 'Delete Schedule',
      warningText:
        'You are about to delete this schedule, are you sure? This cannot be undone',
      description: '',
      handleClose: resetDialog,
      handleSubmit: () => saveSchedule(),
    },
  };

  useEffect(() => {
    if (schedule) setDataModel(ld.cloneDeep(schedule.services));
  }, [schedule]);

  // used to track isScheduleModified
  useEffect(() => {
    setIsScheduleModified(templateChanges.current.changesSeed < -1);
  }, [templateChanges.current.changesSeed]);

  if (!dataModel || !schedule) return <div className={classes.loading}></div>;

  return (
    <div
      className={`main_${scheduleId}`}
      style={{ visibility: isVisible ? 'visible' : 'hidden' }}
    >
      <Prompt when={true} message="You have unsaved changes" />
      <Toolbar
        handleNewServiceClicked={addService}
        destroySchedule={() => deleteSchedule(scheduleId, schedule.title, tab)}
        isScheduleModified={isScheduleModified}
        onSaveSchedule={onSaveSchedule}
        isEditMode={isEditMode}
        enableEditMode={enableEditMode}
        exitEditingClick={exitEditingClick}
      />
      <Table
        schedule={schedule}
        isEditMode={isEditMode}
        dataModel={dataModel}
        setDataModel={setDataModel}
        users={users}
        teams={teams}
        churchId={churchId}
        isScheduleModified={isScheduleModified}
        setIsScheduleModified={setIsScheduleModified}
        incrementChangesSeed={incrementChangesSeed}
      />
      {dialogState.isOpen && (
        <CustomDialog
          open={dialogState.isOpen}
          title={DialogConfig[dialogState.state].title}
          warningText={DialogConfig[dialogState.state].warningText}
          description={DialogConfig[dialogState.state].description}
          handleClose={DialogConfig[dialogState.state].handleClose}
          handleSubmit={DialogConfig[dialogState.state].handleSubmit}
        ></CustomDialog>
      )}
    </div>
  );

  function resetDialog() {
    setDialogState({ state: '', isOpen: false });
  }

  function isStatusWarning(data) {
    let isWarning = false;
    data.forEach((service) => {
      service.events.forEach((event) => {
        isWarning = event.cells.find(
          (cell) => cell.status && cell.status === cellStatus.WARNING,
        );
      });
    });
    // array.find returns undefined if not found
    // eslint-disable-next-line no-undefined
    return isWarning === undefined;
  }

  function onSaveSchedule() {
    // checks if any cells have status: warning
    const isWarning = isStatusWarning(dataModel);
    if (isWarning) {
      setDialogState({ state: CELLWARNING, isOpen: isWarning });
      return;
    }
    saveSchedule();
  }

  function saveSchedule() {
    const diff = updatedDiff(schedule.services, dataModel);
    const processedDiff = processUpdate(diff, dataModel);
    updateSchedule({ tasks: processedDiff });
    resetChangesSeed();
  }

  function addService() {
    const dataClone = [...dataModel];
    dataClone.push(createBlankService(incrementChangesSeed, scheduleId));
    setDataModel(dataClone);
  }

  function incrementChangesSeed(amount = -1) {
    templateChanges.current.changesSeed += amount;
  }

  function resetChangesSeed() {
    templateChanges.current.changesSeed = -1;
  }

  function enableEditMode() {
    if (!isEditMode && !isScheduleModified) setIsEditMode(true);
  }

  function exitEditingClick() {
    saveTemplateChanges();
    // if they choose to not save changes, reset to this orig schedule
    // setDataModel(ld.cloneDeep(schedule.services));
    resetChangesSeed();
    setIsEditMode(false);
  }

  function saveTemplateChanges() {
    const processedChanges = formatData(dataModel, schedule.services);
    updateSchedule({ ...processedChanges });
    resetChangesSeed();
  }
};

const useStyles = makeStyles(() =>
  createStyles({
    loading: {
      ...loadingTheme,
    },
  }),
);

ScheduleMain.propTypes = {
  churchId: PropTypes.number,
  scheduleId: PropTypes.number,
  isVisible: PropTypes.bool,
  users: PropTypes.array,
  teams: PropTypes.array,
  setAlert: PropTypes.func,
  deleteSchedule: PropTypes.func,
  tab: PropTypes.number,
};

export default ScheduleMain;
