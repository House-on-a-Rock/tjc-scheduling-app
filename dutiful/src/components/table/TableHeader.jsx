import {
  TableRow as MuiTableRow,
  TableHead as MuiTableHead,
  makeStyles,
} from '@material-ui/core';
import { TableCell } from '.';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import clsx from 'clsx';

export const TableHeader = ({ headerGroups, sortable, selectable }) => {
  const classes = useStyles();
  return (
    <MuiTableHead>
      {headerGroups.map((headerGroup) => (
        <MuiTableRow {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map((column, columnId) => {
            const isSelection = selectable && !columnId;
            const afterSelection = selectable && columnId === 1;
            const sortProps = sortable && column.getSortByToggleProps();
            return (
              <TableCell
                {...column.getHeaderProps(sortProps)}
                className={clsx(
                  isSelection && classes.selection,
                  afterSelection && classes.afterSelection,
                )}
              >
                <div className={classes.header}>
                  {column.render('Header')}
                  <div>{sortable ? <SortedIcons column={column} /> : <div />}</div>
                </div>
              </TableCell>
            );
          })}
        </MuiTableRow>
      ))}
    </MuiTableHead>
  );
};

const useStyles = makeStyles((theme) => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  selection: {
    padding: 0,
    paddingLeft: '4px',
    width: 'fit-content',
    borderRight: 'none',
  },
  afterSelection: {
    borderLeft: 'none',
    paddingLeft: 0,
  },
}));

const SortedIcons = ({ column }) =>
  column.isSorted &&
  (column.isSortedDesc ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />);
