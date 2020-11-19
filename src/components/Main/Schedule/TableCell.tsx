import React, { useState, useEffect } from 'react';
import Input from '@material-ui/core/Input';
import { DataCellProps } from '../../../shared/types';
import { typographyTheme } from '../../../shared/styles/theme.js';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { ContextMenu } from '../../shared/ContextMenu';

export const DataCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
}: DataCellProps) => {
  const classes = useStyles();

  // We need to keep and update the state of the cell normally

  const [value, setValue] = useState(initialValue?.data);
  const [display, setDisplay] = useState('');

  // value.display ? value.display : `${value.firstName} ${value.lastName}`;
  const onChange = (e: any) => {
    setValue(e.target.value);
  };
  const onBlur = () => {
    updateMyData(index, id, value);
  };

  // Doesn't blur on enter
  const handleEnter = (e: any) => {
    e = e || window.event;
    e.key === 'Enter' && updateMyData(index, id, value);
  };

  // If the initialValue is changed external, sync it up with our state
  useEffect(() => {
    const initialData = initialValue?.data;
    setValue(initialValue?.data);
    if (initialData)
      initialData?.display
        ? setDisplay(initialData.display)
        : setDisplay(`${initialData.firstName} ${initialData.lastName}`);
  }, [initialValue]);

  return initialValue ? (
    <ContextMenu menuId={`${index}-${id}-${display}`} value={display}>
      <Input
        className={classes.input}
        value={display}
        onChange={onChange}
        onBlur={onBlur}
        onKeyUp={(e) => handleEnter(e)}
      />
    </ContextMenu>
  ) : (
    ''
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    input: {
      color: typographyTheme.common.color,
      textAlign: 'center',
    },
  }),
);
