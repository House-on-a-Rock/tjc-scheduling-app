import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TableCell, TextField } from '@material-ui/core';

const TimeCell = ({
  time,
  isDisplayed,
  onChange,
  rowIndex,
  serviceIndex,
  isEditMode,
}) => {
  const [value, setValue] = useState(time);

  const inputProps = isDisplayed
    ? { style: { color: 'black' } }
    : { style: { color: 'rgb(224, 224, 224)' } };

  function onBlurHandler() {
    onChange(value, rowIndex, serviceIndex);
  }

  const displayTime = convert12Hrs(time);

  return !isEditMode ? (
    <TableCell {...inputProps}>{displayTime}</TableCell>
  ) : (
    <TableCell onBlur={onBlurHandler}>
      <TextField
        value={value}
        type="time"
        onChange={(event) => setValue(event.target.value)}
        inputProps={inputProps}
      />
    </TableCell>
  );
};

function convert12Hrs(time) {
  const hrs = time.slice(0, 2);
  const minutes = time.slice(3);
  if (parseInt(hrs) - 12 > 0) return `${parseInt(hrs) - 12}:${minutes} PM`;
  return `${time} AM`;
}

TimeCell.propTypes = {
  time: PropTypes.string,
  isDisplayed: PropTypes.bool,
  onChange: PropTypes.func,
  rowIndex: PropTypes.number,
  serviceIndex: PropTypes.number,
  isEditMode: PropTypes.bool,
};

export default TimeCell;
