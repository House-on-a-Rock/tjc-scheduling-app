import { Popover } from '@material-ui/core';
import { cloneElement, forwardRef } from 'react';
import { TableCell } from '..';

const defaultAnchorOrigin = { vertical: 'top', horizontal: 'left' };
const defaultTransformOrigin = { vertical: 'top', horizontal: 'left' };

export const EditableCell = forwardRef(
  (
    {
      handleClose,
      anchorOrigin = defaultAnchorOrigin,
      transformOrigin = defaultTransformOrigin,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <Popover
        anchorEl={ref.current}
        onClose={handleClose}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        {...props}
      >
        {children}
      </Popover>
    );
  },
);

export const WithEditableCell =
  (Component) =>
  ({ role, key, ...props }) =>
    (
      <TableCell role={role} key={key}>
        {cloneElement(<Component />, { ...props })}
      </TableCell>
    );

export const renderCustomCells = (cell) =>
  cloneElement(cell.render('Cell'), { ...cell.getCellProps() });
