// https://codesandbox.io/s/react-material-ui-and-react-beautiful-dnd-forked-bmheb?file=/src/MaterialTable.jsx draggable table
import React, { useRef, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Prompt } from 'react-router-dom';

import ld from 'lodash';
import { loadingTheme } from '../../shared/styles/theme';
import { createStyles, makeStyles } from '@material-ui/core';

import { Table, ScheduleToolbar } from '.';

import { ContextMenu, ConfirmationDialog } from '../shared';

import {
  days,
  teammates,
  createBlankEvent,
  retrieveDroppableServiceId,
  processUpdate,
  processAdded,
  processRemoved,
} from './utilities';

import useScheduleMainData from '../../hooks/containerHooks/useScheduleMainData';

const SERVICE = 'service';
const EVENT = 'event';
const SCHEDULE = 'schedule';

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
  const [
    isScheduleLoading,
    schedule,
    deleteSchedule,
    updateSchedule,
  ] = useScheduleMainData(scheduleId);

  const [isScheduleModified, setIsScheduleModified] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // const [isNewServiceOpen, setIsNewServiceOpen] = useState(false);

  const [dataModel, setDataModel] = useState();
  const templateChanges = useRef({
    changesSeed: -1,
  });

  useEffect(() => {
    setDataModel(ld.cloneDeep(schedule));
  }, [schedule]);

  const outerRef = useRef(null);

  if (!dataModel) return <div className={classes.loading}></div>;

  console.log(`dataModel`, dataModel);
  // console.log(`isViewed`, isViewed, scheduleId);

  return (
    <div
      className="schedule-container"
      style={{ display: isViewed ? 'block' : 'none' }}
      ref={outerRef}
    >
      <ScheduleToolbar
        handleNewServiceClicked={addService}
        destroySchedule={() => {}}
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
      />
    </div>
  );

  function onSaveScheduleChanges() {
    const diff = updatedDiff(schedule, dataModel);
    // need error checking before running diff
    const updiff = processUpdate(diff, dataModel, tab);
    updateSchedule.mutate({ updated: updiff });
    // setIsScheduleModified(false);  make this an onsuccess?
  }

  function addService() {
    // TODO: bring back create new service form? or another solution is better
    const dataClone = [...dataModel];
    const target = dataClone.services;
    target.push(createBlankService());
    setDataModel(dataClone);
  }

  // function insertRow() {}

  // const handleRowSelected = (isSelected, eventId) =>
  //   isSelected
  //     ? setSelectedEvents(selectedEvents.filter((id) => id !== eventId))
  //     : setSelectedEvents([...selectedEvents, eventId]);

  // function retrieveChangesSeed() {
  //   return templateChanges.current.changesSeed--;
  // }

  // // Model manipulation functions
  // function createBlankService() {
  //   return {
  //     name: 'test',
  //     day: 0,
  //     events: [],
  //     serviceId: retrieveChangesSeed(),
  //   };
  // }

  // // autocomplete cell callback
  // // in the future, can pass in warning icons or tooltips depending on the usecase.
  // // maybe move elsewhere?
  // function renderOption(display, isIconVisible) {
  //   return (
  //     // TODO move div styling somewhere else?
  //     <div
  //       style={{
  //         display: 'flex',
  //         justifyContent: 'center',
  //         alignItems: 'center',
  //       }}
  //     >
  //       {display}
  //       {isIconVisible && (
  //         <RemoveIcon style={{ height: 10, width: 10, paddingLeft: 4 }} /> // icon to show which one the original assignee is. any ideas on a more appropriate icon?
  //       )}
  //     </div>
  //   );
  // }

  // // onChange Handlers
  // function onTaskChange(dataContext, newAssignee) {
  //   const { taskId, serviceIndex, rowIndex, columnIndex } = dataContext;
  //   const dataClone = [...dataModel];
  //   dataClone[tab].services[serviceIndex].events[rowIndex].cells[
  //     columnIndex
  //   ].userId = newAssignee;
  //   setDataModel(dataClone);
  //   setIsScheduleModified(true);
  // }

  // function onAssignedRoleChange(dataContext, newRoleId) {
  //   const { serviceIndex, rowIndex } = dataContext;
  //   const dataClone = [...dataModel];
  //   const targetEvent = dataClone[tab].services[serviceIndex].events[rowIndex];
  //   targetEvent.roleId = newRoleId;

  //   setDataModel(dataClone);
  // }

  // function onTimeChange(newValue, rowIndex, serviceIndex) {
  //   const dataClone = [...dataModel];
  //   dataClone[tab].services[serviceIndex].events[rowIndex].time = newValue;
  //   setDataModel(dataClone);
  // }

  // function rearrangeEvents(prevModel, sourceService, source, destination) {
  //   const temp = [...prevModel];
  //   const scope = temp[tab].services[sourceService].events;
  //   const src = scope.splice(source, 1);
  //   scope.splice(destination, 0, src[0]);
  //   return temp;
  // }

  function onEditClick() {
    //   console.log('edit clicked');
    //   if (!isEditMode) {
    //     if (isScheduleModified) {
    //       setWarningDialog(
    //         'Changes to the schedule must be saved before editing the template',
    //       );
    //       // this needs to be redone
    //     } else {
    //       setIsEditMode(true);
    //     }
    //   } else {
    //     saveTemplateChanges();
    //     setIsEditMode(false);
    //   }
  }

  // function saveTemplateChanges() {
  //   console.log('saving template changes');
  //   // process the diffs
  // }
};

const useStyles = makeStyles(() =>
  createStyles({
    loading: {
      ...loadingTheme,
    },
  }),
);

ScheduleMain.propTypes = {
  scheduleId: PropTypes.number,
  isViewed: PropTypes.bool,
  users: PropTypes.array,
  teams: PropTypes.array,
};

export default ScheduleMain;
