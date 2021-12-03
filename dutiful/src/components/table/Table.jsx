import { useTable } from 'react-table';
import MuiTable from '@material-ui/core/Table';
import { useTableProps } from '@hooks';
import { makeStyles } from '@material-ui/core/styles';

export const Table = ({
  columns,
  data,
  paginatable,
  children,
  sortable,
  updateMethods,
  ...props
}) => {
  const classes = useStyles();
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
    <div {...props} className={classes.root}>
      <div className={classes.table}>
        <MuiTable {...methods.getTableProps()}>
          {header(headerMethods)}
          {body(bodyMethods)}
        </MuiTable>
      </div>
      {pages && <div className={classes.pagination}>{pages(paginationMethods)}</div>}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',

    minHeight: '85vh',
  },
  table: { flexGrow: 1 },
  pagination: { flexShrink: 0, marginTop: '16px' },
}));
