import React, { useState } from 'react';
import { TableCell, TextField } from '@material-ui/core';

export const TimeCell = (props) => {
  const { time, isDisplayed, onChange, rowIndex, serviceIndex } = props;
  const [value, setValue] = useState(time);

  const inputProps = isDisplayed
    ? { style: { color: 'black' } }
    : { style: { color: 'rgb(224, 224, 224)' } };

  function onBlurHandler() {
    onChange(value, rowIndex, serviceIndex);
  }

  return (
    <TableCell onBlur={onBlurHandler}>
      <TextField
        value={value}
        onChange={(event) => setValue(event.target.value)}
        inputProps={inputProps}
      />
    </TableCell>
  );
};
