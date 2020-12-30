import React from 'react';
import { MenuItem, Button } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import { ValidatedTextField, ValidatedSelect } from '../FormControl';
import { useValidatedField } from '../../hooks';

import { buttonTheme } from '../../shared/styles/theme.js';

import { Tooltip } from '../shared/Tooltip';
import { stringLengthCheck } from '../../shared/utilities';
import { HttpErrorProps, NewScheduleData } from '../../shared/types';
// TODO hook up teams with data from DB

interface NewScheduleFormProps {
  onClose: (data: any) => void;
  error: HttpErrorProps;
  onSubmit: (newScheduleData: NewScheduleData) => void;
}

// needed to format date so that the date picker can display it properly
function toDateString(date: Date): string {
  // need to pad months/dates with 0s if single digit
  let month = (date.getMonth() + 1).toString();
  let day = date.getDate().toString();
  month = month.length > 1 ? month : `0${month}`;
  day = day.length > 1 ? day : `0${day}`;

  return `${date.getFullYear()}-${month}-${day}`;
}

export const NewScheduleForm = ({ onClose, error, onSubmit }: NewScheduleFormProps) => {
  const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1));
  const classes = useStyles();

  const [title, setTitle, setTitleError, resetTitleError] = useValidatedField(
    '',
    'Must have a title that is less than 32 characters',
  );
  const [startDate, setStartDate, setStartError, resetStartError] = useValidatedField(
    toDateString(new Date()),
    'Invalid date range',
  );
  const [endDate, setEndDate, setEndError, resetEndError] = useValidatedField(
    toDateString(new Date(tomorrow)),
    'Invalid date range',
  );
  const [team, setTeam, setTeamError, resetTeamError] = useValidatedField(
    0,
    'Please assign a team to this schedule',
  );
  function onSubmitForm() {
    resetTitleError();
    resetStartError();
    resetEndError();
    resetTeamError();

    if (
      title.value.length > 0 &&
      title.value.length < 32 &&
      endDate.value > startDate.value &&
      team.value > 0
    )
      onSubmit({
        title: title.value,
        startDate: startDate.value,
        endDate: endDate.value,
        view: 'weekly',
        team: team.value,
      });

    setTitleError(stringLengthCheck(title.value));
    setStartError(endDate.value < startDate.value);
    setEndError(endDate.value < startDate.value);
    setTeamError(team.value === 0);
  }

  return (
    <div className={classes.root}>
      <h2>Create a new schedule</h2>
      <form className={classes.formStyle}>
        {error && (
          <div style={{ color: 'red' }}>
            {`Status code ${error.status}: ${error.message}`}
          </div>
        )}
        <div className={classes.tooltipContainer}>
          <ValidatedTextField
            className={classes.nameInput}
            label="Schedule Title"
            input={title}
            handleChange={setTitle}
            autoFocus
          />
          <Tooltip
            id="scheduleName"
            text="Example name: Jan-Mar Schedule. Must be unique"
          />
        </div>
        <div className={`${classes.tooltipContainer} ${classes.dateAdjustment}`}>
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
        <ValidatedSelect
          className={classes.selectContainer}
          input={team}
          label="Team"
          onChange={setTeam}
          toolTip={{ id: 'team', text: 'Assign a team to this schedule' }}
        >
          <MenuItem value={0}>Assign this schedule to a team</MenuItem>
          <MenuItem value={1}>Church Council</MenuItem>
          <MenuItem value={2}>RE</MenuItem>
        </ValidatedSelect>
      </form>
      <div className={classes.buttonBottomBar}>
        <Button onClick={onSubmitForm} variant="contained" className={classes.button}>
          Create a new schedule!
        </Button>
        <Button onClick={onClose} className={classes.button}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
      alignItems: 'center',
      width: 'max-content',
      margin: 'auto',
      textAlign: 'center',
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
      width: '100%',
    },
    nameInput: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
    },
    selectContainer: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
    },
    selectInput: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
    },
    dateAdjustment: {
      marginLeft: '-0.6rem',
      marginBottom: '0.5rem',
    },
    button: {
      padding: '10px',
      borderRadius: '5px',
      border: 'none',
      margin: '5px',
      '&:hover, &:focus': {
        ...buttonTheme.filled,
      },
    },
    buttonBottomBar: {
      minHeight: 'unset',
      flexWrap: 'wrap',
      alignSelf: 'end',
    },
  }),
);
