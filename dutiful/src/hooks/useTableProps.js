import { IndeterminateCheckbox } from 'components/checkbox';
import { useSortBy, usePagination, useRowSelect } from 'react-table';

export const useTableProps = ({
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
