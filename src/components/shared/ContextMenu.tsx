/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import { useContextMenu } from '../../hooks';
import { buttonTheme } from '../../shared/styles/theme';

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
        className={classes.contextMenu}
        style={{ position: 'fixed', top: yPos, left: xPos, zIndex: 100 }}
      >
        {cellValue && <li className={classes.cellValue}>{cellValue}</li>}
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

const contextMenuBackground: string = 'lightgray';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    contextMenu: {
      background: contextMenuBackground,
      padding: 0,
      overflow: 'hidden', // to clip children border radii inside parent's
      borderTopLeftRadius: 0,
      borderTopRightRadius: '7px',
      borderBottomLeftRadius: '7px',
      borderBottomRightRadius: '7px',
    },
    cellValue: {
      listStyleType: 'none',
      padding: '0.75em',
      background: contextMenuBackground,
    },
    menuItem: {
      listStyleType: 'none',
      padding: '0.75em',
      background: contextMenuBackground,
      transition: buttonTheme.filled.transition,
      '&:hover, &:focus, &:active': {
        background: buttonTheme.filled.hover.backgroundColor,
        color: buttonTheme.filled.hover.color,
      },
    },
  }),
);
