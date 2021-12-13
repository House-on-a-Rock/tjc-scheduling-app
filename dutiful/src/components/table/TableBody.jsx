import { TableRow, makeStyles } from '@material-ui/core';
import MuiTableBody from '@material-ui/core/TableBody';
import { cloneElement } from 'react';
import { TableCell } from '.';

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
export const renderCustomCells = (cell) =>
  cloneElement(cell.render('Cell'), { ...cell.getCellProps() });

const renderDefaultCells = (cell) => (
  <TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>
);
