import { TableCell } from 'components/table';

const DefaultColumnCell = ({ role, key, className, cell }) => (
  <TableCell role={role} className={className} {...cell.getCellProps()}>
    {cell.value}
  </TableCell>
);

const withCells = (columns) =>
  columns.map((initialColumn) => {
    let column = { ...initialColumn };
    if (!column.Cell) column.Cell = DefaultColumnCell;

    return {
      Header: column.Header,
      accessor: column.accessor,
      Cell: column.Cell,
    };
  });

function constructEmptyRow(columns) {
  const row = {};
  columns.forEach(({ Header, accessor }) => (row[Header] = ''));
  return [row];
}

export { DefaultColumnCell, constructEmptyRow, withCells };
