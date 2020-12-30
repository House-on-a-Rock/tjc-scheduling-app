import React from 'react';

import { MenuItem, Button } from '@material-ui/core/';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import { ValidatedSelect, ValidatedTextField } from '../FormControl';
import { useValidatedField } from '../../hooks';

import { buttonTheme } from '../../shared/styles/theme.js';
import { stringLengthCheck } from '../../shared/utilities';

interface NewServiceFormProps {
  order: number;
  onSubmit: (name: string, order: number, dayOfWeek: number) => void;
  onClose: (arg: any) => void;
  error: any;
}

const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const NewServiceForm = ({
  order,
  onSubmit,
  onClose,
  error,
}: NewServiceFormProps) => {
  const [
    serviceName,
    setServiceName,
    setServiceNameError,
    resetServiceNameError,
  ] = useValidatedField('', 'Must have a name that is less than 32 characters');
  const [dayOfWeek, setDayOfWeek, setDayWeekError, resetDayWeekError] = useValidatedField(
    -1,
    'Must select a day of the week',
  );

  const classes = useStyles();
  const serviceOrder = order + 1;

  function onSubmitForm() {
    resetServiceNameError();
    resetDayWeekError();

    if (
      serviceName.value.length > 0 &&
      serviceName.value.length < 32 &&
      dayOfWeek.value >= 0
    )
      onSubmit(serviceName.value, serviceOrder, dayOfWeek.value);
    setServiceNameError(stringLengthCheck(serviceName.value));
    setDayWeekError(dayOfWeek.value < 0);
  }

  return (
    <div className={classes.root}>
      <h2>New Service Form</h2>
      {error && <div style={{ color: 'red' }}>Service name already exists</div>}
      <form>
        <ValidatedTextField
          name="Service Name"
          label="Service Name"
          input={serviceName}
          handleChange={setServiceName}
          autoFocus
        />
        <ValidatedSelect
          input={dayOfWeek}
          onChange={setDayOfWeek}
          toolTip={{
            id: 'Day of Week',
            text: 'Select the day of the week this schedule is for',
          }}
          label="Day of Week"
          className={classes.selectContainer}
        >
          <MenuItem value={-1}>
            Select which day of the week this schedule is for
          </MenuItem>
          {daysOfWeek.map((day, index) => (
            <MenuItem key={index.toString()} value={index}>
              {day}
            </MenuItem>
          ))}
        </ValidatedSelect>
      </form>
      <Button onClick={onSubmitForm} className={classes.button}>
        Create new service
      </Button>
      <Button onClick={onClose} className={classes.button}>
        Cancel
      </Button>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: 'max-content',
      margin: 'auto',
      textAlign: 'center',
      padding: 10,
    },
    selectContainer: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      minWidth: 400,
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
  }),
);
