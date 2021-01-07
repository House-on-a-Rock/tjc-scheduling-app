import React, { useState } from 'react';
import { TableCell, TextField } from '@material-ui/core';

interface TimeCellProps {
  time: string;
  isDisplayed: boolean;
  onChange: (change: string, rowIndex: number, serviceIndex) => void;
  rowIndex: number;
  serviceIndex: number;
}

export const TimeCell = (props: TimeCellProps) => {
  const { time, isDisplayed, onChange, rowIndex, serviceIndex } = props;
  const [value, setValue] = useState<string>(time);

  // React.useEffect(() => {
  //   console.log('display', display);
  // }, [display]);
  function onBlurHandler() {
    onChange(value, rowIndex, serviceIndex);
  }

  return (
    <TableCell onBlur={onBlurHandler}>
      <TextField
        value={value}
        onChange={(event) => setValue(event.target.value)}
        inputProps={!isDisplayed && { style: { color: 'rgb(224, 224, 224)' } }}
      />
    </TableCell>
  );
};
