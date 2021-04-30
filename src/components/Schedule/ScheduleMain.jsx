// https://codesandbox.io/s/react-material-ui-and-react-beautiful-dnd-forked-bmheb?file=/src/MaterialTable.jsx draggable table
import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// import { Prompt } from 'react-router-dom';

import ld from 'lodash';
import { loadingTheme } from '../../shared/styles/theme';
import { createStyles, makeStyles } from '@material-ui/core';

import Table from './Table';
import Toolbar from './Toolbar';

// import { ContextMenu, ConfirmationDialog } from '../shared';

import { processUpdate, createBlankService } from './utilities';
import { updatedDiff } from 'deep-object-diff';

import useScheduleMainData from '../../hooks/containerHooks/useScheduleMainData';

// TODO
// contextmenu functions don't work
// newly created schedule has strange set of dates
// broke selection/hover of rows
// rework warning dialogs
// how to incorporate NewServiceForm

const ScheduleMain = ({
  churchId,
  scheduleId,
  isViewed,
  users,
  teams,
  setAlert,
  deleteSchedule,
  tab,
}) => {
  const classes = useStyles();
  const [isScheduleModified, setIsScheduleModified] = useState(false);
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

  const outerRef = useRef(null);

  if (!dataModel) return <div className={classes.loading}></div>;

  return (
    <div
      className={`main_${scheduleId}`}
      style={{ visibility: isViewed ? 'visible' : 'hidden' }}
      ref={outerRef}
    >
      <Toolbar
        handleNewServiceClicked={addService}
        destroySchedule={() => deleteSchedule(scheduleId, schedule.title, tab)}
        isScheduleModified={isScheduleModified}
        onSaveScheduleChanges={onSaveScheduleChanges}
        setEditMode={onEditClick}
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
        retrieveChangesSeed={retrieveChangesSeed}
      />
    </div>
  );

  function onSaveScheduleChanges() {
    const diff = updatedDiff(schedule.services, dataModel);
    // need error checking before running diff
    const updiff = processUpdate(diff, dataModel);
    updateSchedule.mutate({ updated: updiff });
    // setIsScheduleModified(false);  make this an onsuccess?
  }

  function addService() {
    const dataClone = [...dataModel];
    dataClone.push(createBlankService(retrieveChangesSeed));
    setDataModel(dataClone);
  }

  // function insertRow() {}

  // const handleRowSelected = (isSelected, eventId) =>
  //   isSelected
  //     ? setSelectedEvents(selectedEvents.filter((id) => id !== eventId))
  //     : setSelectedEvents([...selectedEvents, eventId]);

  function retrieveChangesSeed() {
    return templateChanges.current.changesSeed--;
  }

  function onEditClick() {
    if (!isEditMode && !isScheduleModified) {
      setIsEditMode(true);
    } else {
      saveTemplateChanges();
      setIsEditMode(false);
    }
  }

  function saveTemplateChanges() {
    // console.log('saving template changes');
    // process the diffs
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
  isViewed: PropTypes.bool,
  users: PropTypes.array,
  teams: PropTypes.array,
  setAlert: PropTypes.func,
  // deleteSchedule: PropTypes.object,
  deleteSchedule: PropTypes.func,
  tab: PropTypes.number,
};

export default ScheduleMain;
