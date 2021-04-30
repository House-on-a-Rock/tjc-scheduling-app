import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';

import { CustomDialog } from '../../shared';
import { ValidatedTextField } from '../../FormControl';
import { useValidatedField } from '../../../hooks';
import { buttonTheme } from '../../../shared/styles/theme';

const ACCEPT = 'ACCEPT';
const CLOSE = 'CLOSE';

const RequestAvailabilitiesDialog = ({ open, title, description, handleClick }) => {
  const [deadline, setDeadline] = useValidatedField(
    toDateString(daysAhead(1)),
    'Invalid date range',
  );
  const [start, setStart] = useValidatedField(
    toDateString(daysAhead(2)),
    'Invalid date range',
  );
  const [end, setEnd] = useValidatedField(
    toDateString(daysAhead(3)),
    'Invalid date range',
  );

  function submitRequestAvails(event) {
    event.preventDefault();
    handleClick('ACCEPT', {
      start: start.value,
      end: end.value,
      deadline: deadline.value,
    });
  }

  return (
    <CustomDialog
      open={open}
      title={title}
      label="request-avails-dialog"
      description={description}
      handleClose={() => handleClick(CLOSE)}
      handleSubmit={submitRequestAvails}
    >
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
    </CustomDialog>
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

const useStyles = makeStyles({
  confirmButton: {
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    margin: '5px',
    ...buttonTheme.warning,
  },
  cancelButton: {
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    margin: '5px',
    '&:hover, &:focus': {
      ...buttonTheme.filled,
    },
  },
});

RequestAvailabilitiesDialog.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  description: PropTypes.string,
  handleClick: PropTypes.func,
};

export default RequestAvailabilitiesDialog;
