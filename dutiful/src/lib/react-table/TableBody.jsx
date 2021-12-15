import clsx from 'clsx';
import { cloneElement } from 'react';
import { makeStyles } from '@material-ui/core';
import MuiTableBody from '@material-ui/core/TableBody';
import { TableCell, TableRow } from 'components/table';

export const TableBody = ({ rows, prepareRow, selectable }) => {
  const classes = useStyles();

  const BodyCell = (cell, cellId) => {
    const isSelection = selectable && !cellId;
    const afterSelection = selectable && cellId === 1;
    const className = clsx(
      isSelection && classes.selection,
      afterSelection && classes.afterSelection,
    );
    return cell.column.id === 'selection' ? (
      <TableCell {...cell.getCellProps()} className={className}>
        {cell.render('Cell')}
      </TableCell>
    ) : (
      cloneElement(cell.render('Cell'), { ...cell.getCellProps(), className })
    );
  };
  return (
    <MuiTableBody>
      {rows.map((row) => {
        prepareRow(row);
        return <TableRow {...row.getRowProps()}>{row.cells.map(BodyCell)}</TableRow>;
      })}
    </MuiTableBody>
  );
};

const useStyles = makeStyles((theme) => ({
  row: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  selection: {
    padding: 0,
    paddingLeft: theme.spacing(0.5),
    width: 'fit-content',
    borderRight: 'none',
  },
  afterSelection: {
    borderLeft: 'none',
    paddingLeft: 0,
  },
}));
