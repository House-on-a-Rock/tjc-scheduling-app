import MuiTable from '@material-ui/core/Table';
import MuiTableHead from '@material-ui/core/TableHead';
import MuiTableBody from '@material-ui/core/TableBody';
import MuiTableRow from '@material-ui/core/TableRow';
import MuiTableCell from '@material-ui/core/TableCell';
import { useTable } from 'react-table';

export const Table = ({ columns, data }) => {
  const { getTableProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });
  return (
    <MuiTable {...getTableProps()}>
      <MuiTableHead>
        {headerGroups.map((headerGroup) => (
          <MuiTableRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <MuiTableCell {...column.getHeaderProps()}>
                {column.render('Header')}
              </MuiTableCell>
            ))}
          </MuiTableRow>
        ))}
      </MuiTableHead>
      <MuiTableBody>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <MuiTableRow {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return (
                  <MuiTableCell {...cell.getCellProps()}>
                    {cell.render('Cell')}
                  </MuiTableCell>
                );
              })}
            </MuiTableRow>
          );
        })}
      </MuiTableBody>
    </MuiTable>
  );
};
