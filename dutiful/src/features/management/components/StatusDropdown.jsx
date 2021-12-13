import { makeStyles } from '@material-ui/core';
import { Pill } from 'components/chip';
import { TableCell } from 'components/table';
import { forwardRef } from 'react';

export const StatusDropdown = forwardRef(
  ({ value, row: { index }, column: { id }, updateMyData }, ref) => {
    return (
      <TableCell.Select value={value} ref={ref}>
        <TableCell.Option item={{ value: 'Active' }} component={Pill} />
        <TableCell.Option item={{ value: 'Inactive' }} component={Pill} />
      </TableCell.Select>
    );
  },
);

const useStyles = makeStyles((theme) => ({
  pill: {},
}));
