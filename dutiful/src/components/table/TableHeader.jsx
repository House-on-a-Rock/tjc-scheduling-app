import MuiTableHead from '@material-ui/core/TableHead';
import MuiTableRow from '@material-ui/core/TableRow';
import MuiTableCell from '@material-ui/core/TableCell';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { makeStyles } from '@material-ui/core/styles';

export const TableHeader = ({ headerGroups, sortable }) => {
  const classes = useStyles();
  return (
    <MuiTableHead>
      {headerGroups.map((headerGroup) => (
        <MuiTableRow {...headerGroup.getHeaderGroupProps()} className={classes.header}>
          {headerGroup.headers.map((column) => {
            const sortProps = sortable && column.getSortByToggleProps();
            return (
              <MuiTableCell
                className={classes.cell}
                {...column.getHeaderProps(sortProps)}
              >
                <div style={{ display: 'flex' }}>
                  {column.render('Header')}
                  {sortable && <SortedIcons column={column} />}
                </div>
              </MuiTableCell>
            );
          })}
        </MuiTableRow>
      ))}
    </MuiTableHead>
  );
};

const SortedIcons = ({ column }) =>
  column.isSorted &&
  (column.isSortedDesc ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />);

const useStyles = makeStyles((theme) => ({
  header: {
    backgroundColor: theme.palette.grey[100],
  },
  cell: {
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
  },
}));
