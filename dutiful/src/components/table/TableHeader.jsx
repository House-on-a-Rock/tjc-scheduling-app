import MuiTableHead from '@material-ui/core/TableHead';
import MuiTableRow from '@material-ui/core/TableRow';
import MuiTableCell from '@material-ui/core/TableCell';

export const TableHeader = ({ headerGroups }) => {
  return (
    <MuiTableHead>
      {headerGroups.map((headerGroup) => (
        <MuiTableRow {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map((column) => (
            <MuiTableCell {...column.getHeaderProps(column.getSortByToggleProps())}>
              {column.render('Header')}
              <span>{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
            </MuiTableCell>
          ))}
        </MuiTableRow>
      ))}
    </MuiTableHead>
  );
};
