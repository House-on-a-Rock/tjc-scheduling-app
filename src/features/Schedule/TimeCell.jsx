import { useState } from 'react';
import PropTypes from 'prop-types';
import { TableCell, TextField } from '@material-ui/core';
import { convert12Hrs } from './utilities';

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

TimeCell.propTypes = {
  time: PropTypes.string,
  isDisplayed: PropTypes.bool,
  onChange: PropTypes.func,
  rowIndex: PropTypes.number,
  serviceIndex: PropTypes.number,
  isEditMode: PropTypes.bool,
};

export default TimeCell;
