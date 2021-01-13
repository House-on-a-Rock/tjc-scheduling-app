import React from 'react';

import { MenuItem, Button } from '@material-ui/core/';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import { ValidatedSelect, ValidatedTextField } from '../FormControl';
import { useValidatedField } from '../../hooks';

import { buttonTheme } from '../../shared/styles/theme.js';
import { stringLengthCheck } from '../../shared/utilities';
import { NewServiceData } from '../../shared/types';
import { AxiosError } from 'axios';

interface NewServiceFormProps {
  onSubmit: (newServiceData: NewServiceData) => void;
  onClose: () => void;
  error: AxiosError<any>;
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

export const NewServiceForm = ({ onSubmit, onClose, error }: NewServiceFormProps) => {
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

  function onSubmitForm() {
    resetServiceNameError();
    resetDayWeekError();

    if (
      serviceName.value.length > 0 &&
      serviceName.value.length < 32 &&
      dayOfWeek.value >= 0
    )
      onSubmit({
        name: serviceName.value,
        dayOfWeek: dayOfWeek.value,
      });
    setServiceNameError(stringLengthCheck(serviceName.value));
    setDayWeekError(dayOfWeek.value < 0);
  }

  return (
    <div className={classes.newServiceForm}>
      <h2>Add A New Event</h2>
      {error && (
        <div style={{ color: 'red' }}>
          {`Status code ${error.response.status}: ${error.response.statusText}`}
        </div>
      )}
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

      <div className={classes.buttonBottomBar}>
        <Button onClick={onSubmitForm} className={classes.button}>
          Create new service
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
    newServiceForm: {
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
    buttonBottomBar: {
      minHeight: 'unset',
      flexWrap: 'wrap',
      alignSelf: 'end',
    },
    button: {
      padding: '10px',
      borderRadius: '5px',
      border: 'none',
      margin: '5px',
      '&:hover, &:focus': {
        ...buttonTheme.filled.hover,
      },
    },
  }),
);
