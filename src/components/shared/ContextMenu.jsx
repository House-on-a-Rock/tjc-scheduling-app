import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import { useContextMenu } from '../../hooks';
import { buttonTheme } from '../../shared/styles/theme';

const ContextMenu = ({ outerRef, addRowHandler, deleteRowHandler }) => {
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
        <li className={classes.menuItem} onClick={deleteRowHandler}>
          Delete row
        </li>
      </ul>
    );
  }
  return <></>;
};

const contextMenuBackground = 'lightgray';
const useStyles = makeStyles(() =>
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

ContextMenu.propTypes = {
  outerRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  addRowHandler: PropTypes.func,
  deleteRowHandler: PropTypes.func,
};

export default ContextMenu;
