/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import { useContextMenu } from '../../hooks';

interface ContextMenuProps {
  outerRef: any;
  addRowHandler: (row: number) => void;
  deleteRowHandler: (row: number) => void;
}

export const ContextMenu = ({
  outerRef,
  addRowHandler,
  deleteRowHandler,
}: ContextMenuProps) => {
  const { xPos, yPos, menu, cellValue, cellRow } = useContextMenu(outerRef);
  const classes = useStyles();
  const rowIndex = parseInt(cellRow, 10);

  if (menu) {
    return (
      <ul
        className={classes.menu}
        style={{ position: 'fixed', top: yPos, left: xPos, zIndex: 100 }}
      >
        <li className={classes.menuItem}>{cellValue}</li>
        <li className={classes.menuItem} onClick={() => addRowHandler(rowIndex)}>
          Add new row above
        </li>
        <li className={classes.menuItem} onClick={() => addRowHandler(rowIndex + 1)}>
          Add new row below
        </li>
        <li className={classes.menuItem} onClick={() => deleteRowHandler(rowIndex)}>
          Delete row
        </li>
      </ul>
    );
  }
  return <></>;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menu: {
      borderWidth: 1,
      borderColor: 'black',
      borderStyle: 'solid',
    },
    menuItem: {
      listStyleType: 'none',
      borderWidth: 1,
      borderColor: 'black',
      borderStyle: 'solid',
      backgroundColor: 'white',
      '&:hover, &:focus, &:active': {
        color: 'black',
        background: 'blue',
      },
    },
  }),
);
