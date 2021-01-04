import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

export const ScheduleTableBody = ({ title, children }: any) => {
  //   const classes = useStyles();
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
      <TableRow>
        <TableCell>{title}</TableCell>
      </TableRow>
      {children}
    </>
  );
};

// const useStyles = makeStyles((theme: Theme) =>
//   createStyles({
//     cell: {
//       textAlign: 'center',
//       '&:focus': {
//         outline: 'none',
//       },
//       padding: '1px 0px 2px 0px',
//       height: 20,
//       width: 50,
//       fontSize: 14,
//     },
//   }),
// );
