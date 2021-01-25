import React from 'react';
import { TableCell, TableRow, TableBody } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

export const ScheduleTableBody = ({ title, children }: any) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  return (
    <>
      <TableBody>
        <TableRow onClick={() => setOpen(!open)}>
          <TableCell>{title}</TableCell>
        </TableRow>
      </TableBody>
      <TableBody
        className={`${classes.scheduleTableBody} ${!open && classes.collapsedTableBody}`}
      >
        {children}
      </TableBody>
    </>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    scheduleTableBody: {
      transition: 'transform 0.2s',
      transformOrigin: 'top',
      width: '20ch',
    },
    collapsedTableBody: {
      transform: 'scaleY(0)',
      visibility: 'collapse',
    },
  }),
);
