const { TableCell } = require('..');

export const DefaultColumnCell = ({ role, key, ...props }) => (
  <TableCell role={role} {...props.cell.getCellProps()}>
    {props.cell.value}
  </TableCell>
);
