import clsx from 'clsx';
import { TableHead as MuiTableHead, makeStyles } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { TableCell, TableRow } from 'components/table';

export const TableHeader = ({ headerGroups, sortable, selectable }) => {
  const classes = useStyles();

  const HeaderCell = (column, columnId) => {
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
          {/* // TODO Clicking sort changes row height size */}
          <div>{sortable ? <SortedIcons column={column} /> : <div />}</div>
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
    height: '43px',
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

const SortedIcons = ({ column }) =>
  column.isSorted &&
  (column.isSortedDesc ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />);
