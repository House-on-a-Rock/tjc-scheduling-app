import { makeStyles } from '@material-ui/core';
import { Pill } from 'components/chip';
import { TableCell } from 'components/table';
import { forwardRef } from 'react';

export const StatusDropdown = forwardRef(
  ({ value, row: { index }, column: { id }, updateMyData, ...props }, ref) => {
    const { handleToggle, handleClose, open } = props;
    return (
      <TableCell.Select
        id="status-dropdown"
        value={value}
        ref={ref}
        onClick={handleToggle}
        onClose={handleClose}
        open={open}
      >
        <TableCell.Option component={Pill} label="Active" value="Active" />
        <TableCell.Option component={Pill} label="Inactive" value="Inactive" />
      </TableCell.Select>
    );
  },
);

const useStyles = makeStyles((theme) => ({
  pill: {},
}));
