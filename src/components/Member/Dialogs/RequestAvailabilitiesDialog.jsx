import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
} from '@material-ui/core';

import { ValidatedTextField } from '../../FormControl';
import { useValidatedField } from '../../../hooks';

const RequestAvailabilitiesDialog = ({ state, handleSubmit, title, handleClose }) => {
  const [deadline, setDeadline, setDeadlineError, resetDeadlineError] = useValidatedField(
    toDateString(daysAhead(1)),
    'Invalid date range',
  );
  const [start, setStart, setStartError, resetStartError] = useValidatedField(
    toDateString(daysAhead(2)),
    'Invalid date range',
  );
  const [end, setEnd, setEndError, resetEndError] = useValidatedField(
    toDateString(daysAhead(3)),
    'Invalid date range',
  );

  return (
    <Dialog onBackdropClick={handleClose} open={state}>
      <DialogTitle id={`request-avails-dialog-${title}`}>{title}</DialogTitle>
      <DialogContent>
        <ValidatedTextField
          label="Deadline"
          input={deadline}
          handleChange={setDeadline}
          type="date"
        />
        <ValidatedTextField
          label="Start Date"
          input={start}
          handleChange={setStart}
          type="date"
        />
        <ValidatedTextField
          label="End Date"
          input={end}
          handleChange={setEnd}
          type="date"
        />
      </DialogContent>
      <DialogActions>
        <div>
          <Button onClick={() => handleSubmit(start.value, end.value, deadline.value)}>
            Confirm
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

function toDateString(date) {
  // need to pad months/dates with 0s if single digit
  let month = (date.getMonth() + 1).toString();
  let day = date.getDate().toString();
  month = month.length > 1 ? month : `0${month}`;
  day = day.length > 1 ? day : `0${day}`;
  return `${date.getFullYear()}-${month}-${day}`;
}

const daysAhead = (num) =>
  new Date(new Date(new Date().setDate(new Date().getDate() + num)));

RequestAvailabilitiesDialog.propTypes = {
  state: PropTypes.object,
  handleSubmit: PropTypes.func,
  title: PropTypes.string,
  handleClose: PropTypes.func,
};

export default RequestAvailabilitiesDialog;
