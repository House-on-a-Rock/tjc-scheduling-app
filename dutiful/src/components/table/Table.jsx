import MuiTable from '@material-ui/core/Table';

import { useTable, useSortBy, usePagination, useRowSelect } from 'react-table';
import { forwardRef, useEffect, useRef } from 'react';
import Checkbox from '@material-ui/core/Checkbox';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

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

  const headerMethods = () => ({ headerGroups: methods.headerGroups, sortable });
  const bodyMethods = () => {
    let props = { prepareRow: methods.prepareRow };
    props.rows = paginatable ? methods.page : methods.rows;
    return props;
  };
  const paginationMethods = () => methods;

  return (
    <div {...props}>
      <MuiTable {...methods.getTableProps()}>
        {header(headerMethods())}
        {body(bodyMethods())}
      </MuiTable>
      {pages && <div>{pages(paginationMethods())}</div>}
    </div>
  );
};

const useTableProps = ({
  columns,
  data,
  multiselect,
  paginatable,
  sortable,
  updateMethods,
}) => {
  const tableProps = [{ columns, data, ...updateMethods }];
  const rowSelect = [
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: 'selection',
          Header: ({ getToggleAllPageRowsSelectedProps }) => (
            <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
          ),
          Cell: ({ row }) => (
            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
          ),
        },
        ...columns,
      ]);
    },
  ];
  const pageProps = [usePagination];
  const sortProps = [useSortBy];
  if (multiselect) tableProps.push(...rowSelect);
  if (sortable) tableProps.push(...sortProps);
  if (paginatable) tableProps.push(...pageProps);
  return tableProps;
};

const IndeterminateCheckbox = forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = useRef();
  const resolvedRef = ref || defaultRef;

  useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return <Checkbox ref={resolvedRef} {...rest} />;
});
