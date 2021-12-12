import { TableRow, makeStyles } from '@material-ui/core';
import MuiTableBody from '@material-ui/core/TableBody';
import { renderCustomCells, renderDefaultCells } from '.';

export const TableBody = ({ rows, prepareRow }) => {
  const classes = useStyles();
  return (
    <MuiTableBody>
      {rows.map((row) => {
        prepareRow(row);
        return (
          <TableRow className={classes.row} {...row.getRowProps()}>
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

const useStyles = makeStyles((theme) => ({}));
