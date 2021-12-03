import { useTable } from 'react-table';
import MuiTable from '@material-ui/core/Table';
import { useTableProps } from '@hooks';

export const Table = ({
  columns,
  data,
  paginatable,
  children,
  sortable,
  updateMethods,
  ...props
}) => {
  const [header, body, pages] = children;
  const tableProps = useTableProps({
    columns,
    data,
    multiselect: false,
    paginatable,
    sortable,
    updateMethods,
  });
  const methods = useTable(...tableProps);

  const headerMethods = (() => ({ headerGroups: methods.headerGroups, sortable }))();
  const bodyMethods = (() => {
    let props = { prepareRow: methods.prepareRow };
    props.rows = paginatable ? methods.page : methods.rows;
    return props;
  })();
  const paginationMethods = (() => methods)();

  return (
    <div {...props}>
      <MuiTable {...methods.getTableProps()}>
        {header(headerMethods)}
        {body(bodyMethods)}
      </MuiTable>
      {pages && <div>{pages(paginationMethods)}</div>}
    </div>
  );
};
