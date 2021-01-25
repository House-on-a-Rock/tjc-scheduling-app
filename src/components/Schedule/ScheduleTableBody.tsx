import React from 'react';
import ReactTooltip from 'react-tooltip';
import { TableCell, TableRow, TableBody } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

export const ScheduleTableBody = ({ title, children }: any) => {
  const tooltipId = `${title}_tooltip`;
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [expandedBefore, setExpandedBefore] = React.useState(false);
  return (
    <>
      <TableBody>
        <TableRow
          onClick={() => {
            setOpen(!open);
            if (!open) {
              setExpandedBefore(true);
            }
          }}
        >
          <TableCell className={classes.scheduleTitle} data-tip data-for={tooltipId}>
            {title}
          </TableCell>
          <ReactTooltip id={tooltipId}>
            <span>{`Click to ${open ? 'collapse' : 'expand'}`}</span>
          </ReactTooltip>
        </TableRow>
      </TableBody>
      <TableBody
        className={`${classes.groupOfRows} ${!open && classes.collapsedGroupOfRows} ${
          open && expandedBefore && classes.expandedGroupOfRows
        }`}
      >
        {children}
      </TableBody>
    </>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    scheduleTitle: {},
    groupOfRows: {
      transition: 'transform 0.2s, visibility 0.15s',
      transformOrigin: 'top',
      width: '20ch',
    },
    collapsedGroupOfRows: {
      transform: 'scaleY(0)',
      visibility: 'collapse',
      opacity: 0.5,
      pointerEvents: 'none',
    },
    expandedGroupOfRows: {
      animation: `$flashOfColor 0.25s ${theme.transitions.easing.easeInOut}`,
    },
    '@keyframes flashOfColor': {
      '50%': {
        background: '#add8e65e',
      },
    },
  }),
);
