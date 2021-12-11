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
          <TableRow {...row.getRowProps()} className={classes.row}>
            {/* {row.cells.map((cell) =>
              cloneElement(cell.render('Cell'), { ...cell.getCellProps() }),
            )} */}
            {row.cells.map((cell) => {
              console.log(cell.render('Cell'));
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

const useStyles = makeStyles((theme) => ({
  // row: { backgroundColor: 'red' },
}));
