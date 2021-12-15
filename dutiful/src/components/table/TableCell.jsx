import { cloneElement } from 'react';
import { TableCell as MuiTableCell } from '@material-ui/core';
import { TableOption, TableSelect } from 'components/select';
import { usePortalRef } from 'hooks';

const EditableCell = ({ children, ...props }) => {
  const { open, anchorRef, handleClose, handleSubmit, handleOpen } = usePortalRef();

  return (
    <MuiTableCell onClick={handleOpen} {...props} ref={anchorRef}>
      {cloneElement(children, {
        ref: anchorRef,
        onClick: handleSubmit,
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
  // TODO add primitave children
  if (!editable) return CustomComponent;
  return Editable;
};

TableCell.Select = TableSelect;
TableCell.Option = TableOption;

export { TableCell };
