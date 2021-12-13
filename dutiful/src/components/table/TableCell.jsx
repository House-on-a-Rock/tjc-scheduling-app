import { TableCell as MuiTableCell } from '@material-ui/core';
import { TableOption, TableSelect } from 'components/select';
import { cloneElement, useRef } from 'react';

const EditableCell = ({ children, ...props }) => {
  const anchorRef = useRef(null);
  return (
    <MuiTableCell {...props} ref={anchorRef}>
      {cloneElement(children, { ref: anchorRef })}
    </MuiTableCell>
  );
};

const TableCell = ({ editable, children, ...props }) => {
  const Base = <MuiTableCell {...props}>{children}</MuiTableCell>;
  const CustomComponent = <MuiTableCell {...props}>{children}</MuiTableCell>;
  const Editable = <EditableCell {...props}>{children}</EditableCell>;

  if (typeof children === 'string') return Base;
  if (!editable) return CustomComponent;
  return Editable;
};

TableCell.Select = TableSelect;
TableCell.Option = TableOption;

export { TableCell };
