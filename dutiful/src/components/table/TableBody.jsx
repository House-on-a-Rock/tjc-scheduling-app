import MuiTableBody from '@material-ui/core/TableBody';

export const TableBody = ({ page, prepareRow }) => {
  return (
    <MuiTableBody>
      {page.map((row, i) => {
        prepareRow(row);
        return (
          <tr {...row.getRowProps()}>
            {row.cells.map((cell) => {
              return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
            })}
          </tr>
        );
      })}
    </MuiTableBody>
  );
};
