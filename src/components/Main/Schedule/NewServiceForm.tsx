import React, { useState } from 'react';
import { Select } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import { Tooltip } from '../../shared/Tooltip';
import {
  ValidatedTextField,
  createTextFieldState,
  constructError,
} from '../../shared/ValidatedTextField';
import { TextFieldState } from '../../../shared/types';

interface NewServiceFormProps {
  order: number;
  onSubmit: (name: string, order: number, dayOfWeek: number) => void;
  onClose: () => void;
}

// are these used anywhere else?
const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      height: 400,
      width: 400,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
    },
    formInput: { width: 300 },
    selectInput: {
      width: 300,
    },
  }),
);

export const NewServiceForm = ({ order, onSubmit, onClose }: NewServiceFormProps) => {
  const classes = useStyles();
  const [serviceName, setServiceName] = useState<TextFieldState>(
    createTextFieldState(''),
  );
  const [dayOfWeek, setDayOfWeek] = useState<TextFieldState>(createTextFieldState('-1'));

  function onSubmitForm() {
    setServiceName({ ...serviceName, valid: true, message: '' });
    setDayOfWeek({ ...dayOfWeek, valid: true, message: '' });

    const dayInt = parseInt(dayOfWeek.value, 10);

    if (serviceName.value.length && serviceName.value.length < 32 && dayInt >= 0)
      onSubmit(serviceName.value, order + 1, dayInt);

    constructError(
      serviceName.value.length === 0 || serviceName.value.length >= 32,
      'Title must be not be blank and be under 32 characters long',
      serviceName,
      setServiceName,
    );
    constructError(dayInt < 0, 'Must select a day of the week', dayOfWeek, setDayOfWeek);
  }

  return (
    <div className={classes.root}>
      New Service Form
      <form>
        <ValidatedTextField
          className={classes.formInput}
          name="Service Name"
          label="Service Name"
          input={serviceName}
          handleChange={setServiceName}
          autofocus
        />
        <FormControl>
          <InputLabel>Day of the Week</InputLabel>
          <Select
            className={classes.selectInput}
            required
            value={dayOfWeek.value}
            variant="outlined"
            onChange={(e) =>
              setDayOfWeek({ ...dayOfWeek, value: e.target.value as string })
            }
          >
            <MenuItem value={-1}>
              Select which day of the week this schedule is for
            </MenuItem>
            {daysOfWeek.map((day, index) => (
              <MenuItem key={index.toString()} value={index}>
                {day}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText style={{ color: 'red' }}>{dayOfWeek.message}</FormHelperText>
          <Tooltip
            id="Day of week"
            text="Select on which day of the week this service occurs"
          />
        </FormControl>
      </form>
      <button type="submit" onClick={onSubmitForm}>
        Create new service
      </button>
      <button type="button" onClick={onClose}>
        Cancel
      </button>
    </div>
  );
};
