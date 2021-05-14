// https://codesandbox.io/s/react-material-ui-and-react-beautiful-dnd-forked-bmheb?file=/src/MaterialTable.jsx draggable table
import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// import { Prompt } from 'react-router-dom';

import ld from 'lodash';
import { loadingTheme } from '../../shared/styles/theme';
import { createStyles, makeStyles } from '@material-ui/core';

import Table from './Table';
import Toolbar from './Toolbar';

import { processUpdate, createBlankService, formatData, cellStatus } from './utilities';
import { updatedDiff } from 'deep-object-diff';

import useScheduleMainData from '../../hooks/containerHooks/useScheduleMainData';
import CustomDialog from '../shared/CustomDialog';

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
  const [isScheduleWarning, setIsScheduleWarning] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
      <CustomDialog
        open={isDialogOpen}
        title="Improperly assigned cells"
        warningText="Improperly assigned cells"
        handleClose={() => setIsDialogOpen(false)}
      ></CustomDialog>
    </div>
  );

  function isWarningStatus(data) {
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
    // check if any cells have status: warning
    const isWarning = isWarningStatus(dataModel);
    setIsDialogOpen(isWarning);

    const diff = updatedDiff(schedule.services, dataModel);
    const processedDiff = processUpdate(diff, dataModel);
    updateSchedule.mutate({ tasks: processedDiff });
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
    updateSchedule.mutate({ ...processedChanges });
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
