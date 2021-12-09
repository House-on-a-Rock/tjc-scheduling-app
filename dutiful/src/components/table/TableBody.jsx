import { TableRow, TableCell, makeStyles } from '@material-ui/core';
import MuiTableBody from '@material-ui/core/TableBody';

export const TableBody = ({ rows, prepareRow }) => {
  const classes = useStyles();
  return (
    <MuiTableBody>
      {rows.map((row) => {
        prepareRow(row);
        return (
          <TableRow {...row.getRowProps()} className={classes.row}>
            {row.cells.map((cell) => {
              console.log({ cell });
              return (
                <TableCell
                // {...cell.getCellProps()}
                >
                  {cell.render('Cell')}
                </TableCell>
              );
            })}
          </TableRow>
        );
      })}
    </MuiTableBody>
  );
};

const useStyles = makeStyles((theme) => ({
  row: {
    '&:nth-of-type(even)': {
      backgroundColor: theme.palette.grey[100],
    },
  },
}));
