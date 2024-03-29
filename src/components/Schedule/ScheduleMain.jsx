/* eslint-disable no-undefined */
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
import NewTemplateForm from '../shared/NewTemplateForm';

// tbh i think my function names are kinda scuffed, and my dialog text is very scuffed so

const ScheduleMain = ({
  churchId,
  scheduleId,
  isVisible,
  users,
  teams,
  setAlert,
  deleteSchedule,
  tab,
  isEditMode,
  setIsEditMode,
}) => {
  const classes = useStyles();
  const [dataModel, setDataModel] = useState();
  const [isScheduleModified, setIsScheduleModified] = useState(false);
  const [dialogState, setDialogState] = useState({ isOpen: false, state: '' });
  const [isTemplateFormOpen, setIsTemplateFormOpen] = useState(false);
  const changesCounter = useRef(0);

  const [schedule, updateSchedule, createNewTemplate] = useScheduleMainData(
    scheduleId,
    setIsScheduleModified,
    setAlert,
    setIsTemplateFormOpen,
  );

  const CELLWARNING = 'CELLWARNING';
  const DELETESCHEDULE = 'DELETESCHEDULE';
  const SAVEEDITS = 'SAVEEDITS';
  const RESET = 'RESET';

  const DialogConfig = {
    CELLWARNING: {
      title: 'Improperly assigned cells',
      warningText:
        'Tasks with a red background are improperly assigned. You may save, but you will be unable to publish this schedule until those tasks are assigned properly',
      description: '',
      handleClose: resetDialog,
      handleSubmit: (event) => dialogSubmitWrapper(event, saveSchedule),
    },
    DELETESCHEDULE: {
      title: 'Delete Schedule',
      warningText:
        'You are about to delete this schedule, are you sure? This cannot be undone',
      description: '',
      handleClose: resetDialog,
      handleSubmit: (event) =>
        dialogSubmitWrapper(event, () => deleteSchedule(scheduleId, schedule.title, tab)),
    },
    SAVEEDITS: {
      title: 'Save changes',
      description: 'Are you sure you would to save these changes?',
      cancelText: 'Return to editing',
      confirmText: 'Save and finish editing',
      handleClose: resetDialog,
      handleSubmit: (event) => dialogSubmitWrapper(event, saveTemplateChanges),
    },
    RESET: {
      title: 'Discard changes',
      description:
        'You are about to discard your current changes, are you sure? This cannot be undone',
      handleClose: resetDialog,
      handleSubmit: (event) => dialogSubmitWrapper(event, reset),
    },
  };

  useEffect(() => {
    if (schedule) setDataModel(ld.cloneDeep(schedule.services));
  }, [schedule]);

  useEffect(() => {
    if (dataModel) {
      let isModified = false;
      isModified = dataModel.find((service) =>
        service.events.find((event) =>
          event.cells.find((cell) => cell.status && cell.status === cellStatus.MODIFIED),
        ),
      );
      setIsScheduleModified(isModified !== undefined);
    }
  }, [dataModel]);

  if (!dataModel || !schedule) return <div className={classes.loading}></div>;

  return (
    <div
      className={`main_${scheduleId}`}
      style={{ display: isVisible ? 'block' : 'none' }}
    >
      <Toolbar
        handleNewServiceClicked={addService}
        destroySchedule={onDestroySchedule}
        isScheduleModified={isScheduleModified}
        onSaveSchedule={onSaveSchedule}
        isEditMode={isEditMode}
        enableEditMode={enableEditMode}
        onSaveEdits={onSaveEdits}
        onCancelEdits={onCancelEdits}
        onResetClick={onResetClick}
        onSaveTemplate={() => setIsTemplateFormOpen(true)}
      />
      <Table
        schedule={schedule}
        isEditMode={isEditMode}
        isVisible={isVisible}
        dataModel={dataModel}
        setDataModel={setDataModel}
        users={users}
        teams={teams}
        churchId={churchId}
        setIsScheduleModified={setIsScheduleModified}
        incrementChangesCounter={incrementChangesCounter}
      />
      {dialogState.isOpen && (
        <CustomDialog open={dialogState.isOpen} {...DialogConfig[dialogState.state]} />
      )}
      {isTemplateFormOpen && (
        <NewTemplateForm
          open={isTemplateFormOpen}
          handleClick={saveTemplate}
          handleClose={onTemplateFormClose}
          error={createNewTemplate.error}
          template={prepareNewTemplate(dataModel)}
        />
      )}
    </div>
  );

  function onTemplateFormClose() {
    setIsTemplateFormOpen(false);
    createNewTemplate.reset();
  }

  function saveTemplate(templateName) {
    const newTemplate = prepareNewTemplate(dataModel);
    createNewTemplate.mutate({ data: newTemplate, churchId, name: templateName });
  }

  function prepareNewTemplate(model) {
    const newTemplate = model.map((service) => {
      const { day, events, name } = service;
      const e = events.map((event) => {
        const { roleId, time } = event;
        const roleName = teams[teams.findIndex((team) => team.id === roleId)].name;

        return { roleId, time, title: roleName };
      });
      return {
        day,
        events: e,
        name,
      };
    });
    return newTemplate;
  }

  function incrementChangesCounter() {
    changesCounter.current += 1;
    return changesCounter.current;
  }

  function resetChangesCounter() {
    changesCounter.current = 0;
  }

  function onResetClick() {
    setDialogState({ isOpen: true, state: RESET });
  }

  function reset() {
    setDataModel(ld.cloneDeep(schedule.services));
  }

  function dialogSubmitWrapper(event, callback) {
    event.preventDefault();
    callback();
    resetDialog();
  }

  function onDestroySchedule() {
    setDialogState({ state: DELETESCHEDULE, isOpen: true });
  }

  function resetDialog() {
    setDialogState({ state: '', isOpen: false });
  }

  function isStatusWarning(data) {
    let isWarning = false;
    isWarning = data.find((service) =>
      service.events.find((event) =>
        event.cells.find((cell) => cell.status && cell.status === cellStatus.WARNING),
      ),
    );
    // array.find returns undefined if not found
    return isWarning !== undefined;
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
    updateSchedule({ tasks: processedDiff, scheduleId });
    resetChangesCounter();
  }

  function addService() {
    const dataClone = [...dataModel];
    dataClone.push(createBlankService(scheduleId, incrementChangesCounter));

    setDataModel(dataClone);
  }

  function enableEditMode() {
    setIsEditMode(!isEditMode && !isScheduleModified);
  }

  function onSaveEdits() {
    setDialogState({ isOpen: true, state: SAVEEDITS });
  }

  function onCancelEdits() {
    setDataModel(ld.cloneDeep(schedule.services));

    setIsEditMode(false);
  }

  function saveTemplateChanges() {
    const processedChanges = formatData(dataModel, schedule.services, scheduleId);
    updateSchedule({ ...processedChanges, scheduleId });

    setIsEditMode(false);
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
  isEditMode: PropTypes.bool,
  setIsEditMode: PropTypes.func,
};

export default ScheduleMain;
