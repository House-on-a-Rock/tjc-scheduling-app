import React from 'react';
import { TableCell, TableRow, TableBody } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

export const ScheduleTableBody = ({ title, children }: any) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  //   const [isChildrenVisible, setChildrenVisible] = React.useState(true);
  // collapsible table body logic
  //   onClick={() => {
  //     setChildrenVisible((d) => !d);
  //   }}
  // would like to use <Collapse /> component from material ui, but it changes the structure of the schedule:
  // <table>
  //    <tr> <CollapsibleComponent /> <tr/>
  // </table>
  // where <CollapsibleComponent /> is another <table><tr>ScheduleBody</tr></table>
  // https://material-ui.com/components/tables/#collapsible-table
  // collapse function and icons will only show if there are multiple functions/services/events (idk what we're calling it as of today) as there are no need for icons and collapsible function if there aren't more than one

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
        {/* <div className={classes.scheduleTableBody}> */}
        {/* <TableRow onClick={() => setOpen(!open)}>
        <TableCell>{title}</TableCell>
      </TableRow> */}
        {children}
        {/* </div> */}
      </TableBody>
    </>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    scheduleTableBody: {
      transition: 'transform 0.2s',
      width: '20ch',
    },
    collapsedTableBody: {
      transform: 'scaleY(0)',
      transformOrigin: 'top',
      visibility: 'collapse',
    },
  }),
);
