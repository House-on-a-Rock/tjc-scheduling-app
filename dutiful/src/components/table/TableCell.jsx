import { TableCell as MuiTableCell } from '@material-ui/core';
import { useRef } from 'react';

export const TableCell = ({ children, ...props }) => {
  const anchorRef = useRef(null);
  return <MuiTableCell {...props}>{children}</MuiTableCell>;
};
