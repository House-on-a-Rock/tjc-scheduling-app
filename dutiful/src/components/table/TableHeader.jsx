import MuiTableHead from '@material-ui/core/TableHead';
import MuiTableRow from '@material-ui/core/TableRow';
import MuiTableCell from '@material-ui/core/TableCell';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

export const TableHeader = ({ headerGroups, sortable }) => {
  return (
    <MuiTableHead>
      {headerGroups.map((headerGroup) => (
        <MuiTableRow {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map((column) => {
            const sortProps = sortable && column.getSortByToggleProps();
            return (
              <MuiTableCell {...column.getHeaderProps(sortProps)}>
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
