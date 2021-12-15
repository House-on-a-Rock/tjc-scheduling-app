import clsx from 'clsx';
import { TableHead as MuiTableHead, makeStyles } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { TableCell, TableRow } from 'components/table';

export const TableHeader = ({ headerGroups, sortable, selectable }) => {
  const classes = useStyles();

  const HeaderCell = (column, columnId) => {
    const isSelection = selectable && !columnId;
    const followingSelection = selectable && columnId === 1;

    const className = clsx(
      isSelection && classes.selection,
      followingSelection && classes.followingSelection,
      !isSelection && classes.nonSelection,
    );
    const sortProps = sortable && column.getSortByToggleProps();
    return (
      <TableCell {...column.getHeaderProps(sortProps)} className={className}>
        <div className={classes.header}>
          {column.render('Header')}
          {/* // TODO Clicking sort changes row height size */}
          <div className={classes.icons}>
            {sortable ? <SortedIcons column={column} /> : <div />}
          </div>
        </div>
      </TableCell>
    );
  };
  return (
    <MuiTableHead>
      {headerGroups.map((headerGroup) => (
        <TableRow {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map(HeaderCell)}
        </TableRow>
      ))}
    </MuiTableHead>
  );
};

const useStyles = makeStyles((theme) => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: 600,
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
  icons: { marginTop: theme.spacing(1) },
}));

const SortedIcons = ({ column }) =>
  column.isSorted &&
  (column.isSortedDesc ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />);
