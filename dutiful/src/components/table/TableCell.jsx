import { usePortalRef } from '@hooks';
import { TableCell as MuiTableCell } from '@material-ui/core';
import { TableOption, TableSelect } from 'components/select';
import { cloneElement } from 'react';

const EditableCell = ({ children, ...props }) => {
  const { open, anchorRef, handleClose, handleToggle } = usePortalRef();

  return (
    <MuiTableCell onClick={handleToggle} {...props} ref={anchorRef}>
      {cloneElement(children, {
        ref: anchorRef,
        handleToggle,
        onClose: handleClose,
        open,
      })}
    </MuiTableCell>
  );
};

const TableCell = ({ editable, children, ...props }) => {
  const Base = <MuiTableCell {...props}>{children}</MuiTableCell>;
  const CustomComponent = <MuiTableCell {...props}>{children}</MuiTableCell>;
  const Editable = <EditableCell {...props}>{children}</EditableCell>;

  if (typeof children === 'string') return Base;
  // add some primitive checks
  if (!editable) return CustomComponent;
  return Editable;
};

TableCell.Select = TableSelect;
TableCell.Option = TableOption;

export { TableCell };
