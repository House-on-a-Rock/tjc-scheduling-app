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

  return !isEditMode ? (
    <TableCell>{value}</TableCell>
  ) : (
    <TableCell onBlur={onBlurHandler}>
      <TextField
        value={value}
        onChange={(event) => setValue(event.target.value)}
        inputProps={inputProps}
      />
    </TableCell>
  );
};

TimeCell.propTypes = {
  time: PropTypes.string,
  isDisplayed: PropTypes.bool,
  onChange: PropTypes.func,
  rowIndex: PropTypes.number,
  serviceIndex: PropTypes.number,
  isEditMode: PropTypes.bool,
};

export default TimeCell;
