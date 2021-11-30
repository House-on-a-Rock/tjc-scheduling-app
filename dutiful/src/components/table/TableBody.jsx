import { TableRow, TableCell } from '@material-ui/core';
import MuiTableBody from '@material-ui/core/TableBody';

export const TableBody = ({ rows, prepareRow }) => {
  return (
    <MuiTableBody>
      {rows.map((row) => {
        prepareRow(row);
        return (
          <TableRow {...row.getRowProps()}>
            {row.cells.map((cell) => {
              return (
                <TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>
              );
            })}
          </TableRow>
        );
      })}
    </MuiTableBody>
  );
};
