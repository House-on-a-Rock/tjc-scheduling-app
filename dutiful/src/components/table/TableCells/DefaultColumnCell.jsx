const { TableCell } = require('..');

export const DefaultColumnCell = ({ role, key, ...props }) => (
  <TableCell role={role} {...props.cell.getCellProps()}>
    {props.cell.value}
  </TableCell>
);

export const renderDefaultCells = (cell) => (
  <TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>
);
