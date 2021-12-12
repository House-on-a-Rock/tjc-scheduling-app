import { DefaultColumnCell } from 'components/table';

const withDefaultCells = (columns) =>
  columns.map((initialColumn) => {
    let column = { ...initialColumn };
    if (!column.Cell) column.Cell = DefaultColumnCell;
    return column;
  });

function constructEmptyRow(columns) {
  const row = {};
  columns.forEach(({ Header, accessor }) => (row[Header] = ''));
  return [row];
}

export { withDefaultCells, constructEmptyRow };
