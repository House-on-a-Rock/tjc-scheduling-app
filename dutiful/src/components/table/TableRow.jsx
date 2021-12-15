import { TableRow as MuiTableRow } from '@material-ui/core';

export const TableRow = ({ selectable, children, ...props }) => {
  return <MuiTableRow {...props}>{children}</MuiTableRow>;
};
