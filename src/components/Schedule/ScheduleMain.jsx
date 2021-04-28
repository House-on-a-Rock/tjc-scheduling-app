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
// Need to wait for create schedule to finish updating db before the user can click on the new tab, or else data will be missing
// newly created schedule has strange set of dates
// rethink where to put draggable handles and how to display them
// broke selection/hover of rows?
// make sure the edit schedule button works only when schedule is saved.
// rework warning dialogs

const ScheduleMain = ({ churchId, scheduleId, isViewed, users, teams }) => {
  const classes = useStyles();
  const [schedule, deleteSchedule, updateSchedule] = useScheduleMainData(scheduleId);

  const [isScheduleModified, setIsScheduleModified] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  // const [isNewServiceOpen, setIsNewServiceOpen] = useState(false);

  const [dataModel, setDataModel] = useState();
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
      style={{ display: isViewed ? 'block' : 'none' }}
      ref={outerRef}
    >
      <Toolbar
        handleNewServiceClicked={addService}
        destroySchedule={() =>
          deleteSchedule.mutate({
            scheduleId: schedule.scheduleId,
            title: schedule.title,
          })
        }
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
    // TODO: bring back create new service form? or another solution is better
    const dataClone = [...dataModel];
    const target = dataClone.services;
    target.push(createBlankService(retrieveChangesSeed));
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

  // // Model manipulation functions

  function onEditClick() {
    if (!isEditMode && !isScheduleModified) {
      setIsEditMode(true);
    } else {
      saveTemplateChanges();
      setIsEditMode(false);
    }
  }

  function saveTemplateChanges() {
    console.log('saving template changes');
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
};

export default ScheduleMain;
