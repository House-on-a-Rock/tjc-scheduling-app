import React, { useState } from 'react';
import { Select } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';
import { toDateString } from '../../../shared/utilities';

import {
  ValidatedTextField,
  createTextFieldState,
  constructError,
} from '../../shared/ValidatedTextField';
import { TextFieldState } from '../../../shared/types/models';
import { Tooltip } from '../../shared/Tooltip';

// TODO hook up teams with data from DB

interface NewScheduleFormProps {
  onSubmit: (
    scheduleTitle: string,
    startDate: string,
    endDate: string,
    view: string,
    team: number,
  ) => void;
  onClose: () => void;
}

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      position: 'fixed',
      top: '25%',
      left: '25%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
      alignItems: 'center',
      height: '50%',
      width: '50%',
      backgroundColor: 'white',
      padding: 20,
      zIndex: 10,
    },
    formStyle: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    datePicker: {
      margin: 5,
    },
    tooltipContainer: {
      display: 'flex',
      flexDirection: 'row',
    },
    nameInput: {
      width: 300,
    },
    selectContainer: {
      width: 400,
    },
    selectInput: {
      width: 300,
    },
  }),
);

export const NewScheduleForm = ({ onSubmit, onClose }: NewScheduleFormProps) => {
  const today = new Date();
  const tomorrow = new Date(today.setDate(today.getDate() + 1));
  const [scheduleTitle, setScheduleTitle] = useState<TextFieldState>(
    createTextFieldState(''),
  );
  const [startDate, setStartDate] = useState<TextFieldState>(
    createTextFieldState(toDateString(new Date())),
  );
  const [endDate, setEndDate] = useState<TextFieldState>(
    createTextFieldState(toDateString(new Date(tomorrow))),
  );
  const view = 'weekly';
  const [team, setTeam] = useState<TextFieldState>(createTextFieldState('0'));
  const classes = useStyles();

  function onSubmitForm() {
    // this need to be reworked now that the button type is submit
    setScheduleTitle({ ...scheduleTitle, valid: true, message: '' });
    setStartDate({ ...startDate, valid: true, message: '' });
    setEndDate({ ...endDate, valid: true, message: '' });
    setTeam({ ...team, valid: true, message: '' });
    const teamInt = parseInt(team.value, 10);
    if (
      scheduleTitle.value.length &&
      scheduleTitle.value.length < 32 &&
      endDate.value > startDate.value &&
      teamInt > 0
    )
      onSubmit(scheduleTitle.value, startDate.value, endDate.value, view, teamInt);

    constructError(
      scheduleTitle.value.length === 0 || scheduleTitle.value.length >= 32,
      'Title must not be blank and be under 32 characters long',
      scheduleTitle,
      setScheduleTitle,
    );
    constructError(
      endDate.value < startDate.value,
      'Invalid date range',
      endDate,
      setEndDate,
    );
    constructError(
      endDate.value < startDate.value,
      'Invalid date range',
      startDate,
      setStartDate,
    );
    constructError(teamInt === 0, 'Please assign a team to this schedule', team, setTeam);
  }

  return (
    <div className={classes.root}>
      New Schedule Form
      <form className={classes.formStyle}>
        <div className={classes.tooltipContainer}>
          <ValidatedTextField
            className={classes.nameInput}
            name="Schedule Title"
            label="Schedule Title"
            input={scheduleTitle}
            handleChange={setScheduleTitle}
            autofocus
          />
          <Tooltip
            id="scheduleName"
            text="Example name: Jan-Mar Schedule. Must be unique"
          />
        </div>
        <div className={classes.tooltipContainer}>
          <ValidatedTextField
            className={classes.datePicker}
            label="Start Date"
            input={startDate}
            handleChange={setStartDate}
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <ValidatedTextField
            className={classes.datePicker}
            label="End Date"
            input={endDate}
            handleChange={setEndDate}
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Tooltip
            id="datePicker"
            text="Select the begin date and end date for this schedule"
          />
        </div>

        <FormControl className={classes.selectContainer} error={!team.valid}>
          <InputLabel>Team</InputLabel>
          <Select
            className={classes.selectInput}
            value={team.value}
            required
            variant="outlined"
            onChange={(e) => setTeam({ ...team, value: e.target.value as string })}
          >
            <MenuItem value={0}>Assign this schedule to a team</MenuItem>
            <MenuItem value={1}>Church Council</MenuItem>
            <MenuItem value={2}>RE</MenuItem>
          </Select>
          <FormHelperText style={{ color: 'red' }}>{team.message}</FormHelperText>
          <Tooltip id="Team" text="Select who is able to edit this schedule" />
        </FormControl>
      </form>
      <button type="submit" onClick={onSubmitForm}>
        Create a new schedule!
      </button>
      <button type="button" onClick={onClose}>
        Cancel
      </button>
    </div>
  );
};
