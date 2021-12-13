import { TableCell } from 'components/table';
import { cloneElement } from 'react';

const renderCustomCells = (cell) =>
  cloneElement(cell.render('Cell'), { ...cell.getCellProps() });

const renderDefaultCells = (cell) => (
  <TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>
);

const DefaultColumnCell = ({ role, key, ...props }) => (
  <TableCell role={role} {...props.cell.getCellProps()}>
    {props.cell.value}
  </TableCell>
);

const applyProps =
  (Cell, props) =>
  ({ role, ...rTableProps }) =>
    (
      <TableCell role={role} {...props}>
        {cloneElement(<Cell />, { ...rTableProps })}
      </TableCell>
    );

const withCells = (columns) =>
  columns.map((initialColumn) => {
    let column = { ...initialColumn };
    if (!column.Cell) column.Cell = DefaultColumnCell;
    else column.Cell = applyProps(column.Cell, column.props);
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

export {
  renderCustomCells,
  renderDefaultCells,
  DefaultColumnCell,
  constructEmptyRow,
  withCells,
};
