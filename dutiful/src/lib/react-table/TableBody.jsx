import clsx from 'clsx';
import { cloneElement } from 'react';
import { TableBody as MuiTableBody, makeStyles } from '@material-ui/core';
import { TableCell, TableRow } from 'components/table';

export const TableBody = ({ rows, prepareRow, selectable }) => {
  const classes = useStyles();

  const BodyCell = (cell, cellId) => {
    const isSelection = selectable && !cellId;
    const followingSelection = selectable && cellId === 1;
    const className = clsx(
      isSelection && classes.selection,
      followingSelection && classes.followingSelection,
      !isSelection && classes.nonSelection,
    );

    return cell.column.id === 'selection' ? (
      <TableCell {...cell.getCellProps()} className={className}>
        {cell.render('Cell')}
      </TableCell>
    ) : (
      cloneElement(cell.render('Cell'), { ...cell.getCellProps(), className })
    );
  };

  // TODO ugly styling
  // TODO ugly logic (BodyCell || NewBodyCell)

  const NewBodyCell = (cell, cellId) => {
    const isSelection = selectable && !cellId;
    const followingSelection = selectable && cellId === 1;
    const className = clsx(
      isSelection && classes.selection,
      followingSelection && classes.followingSelection,
      !isSelection && classes.nonSelection,
      classes.new,
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
        const newRow = row.original.newItem;
        return (
          <TableRow {...row.getRowProps()}>
            {row.cells.map(newRow ? NewBodyCell : BodyCell)}
          </TableRow>
        );
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
  followingSelection: {
    borderLeft: 'none',
    paddingLeft: 0,
  },
  nonSelection: { minWidth: theme.spacing(15) },
  new: {
    borderTop: 'dotted 2px',
    borderBottom: 'dotted 2px',
    borderTopColor: theme.palette.primary.light,
    borderBottomColor: theme.palette.primary.light,
    '&:first-child': {
      borderLeft: 'dotted 2px',
      borderRadius: '4px',
      borderLeftColor: theme.palette.primary.light,
    },
    '&:last-child': {
      borderRight: 'dotted 2px',
      borderRadius: '4px',
      borderRightColor: theme.palette.primary.light,
    },
  },
}));
