import { TableRow } from '@material-ui/core';
import MuiTableBody from '@material-ui/core/TableBody';
import { renderCustomCells, renderDefaultCells } from 'lib/react-table';

export const TableBody = ({ rows, prepareRow }) => {
  return (
    <MuiTableBody>
      {rows.map((row) => {
        prepareRow(row);
        return (
          <TableRow {...row.getRowProps()}>
            {row.cells.map((cell) =>
              cell.column.id === 'selection'
                ? renderDefaultCells(cell)
                : renderCustomCells(cell),
            )}
          </TableRow>
        );
      })}
    </MuiTableBody>
  );
};
