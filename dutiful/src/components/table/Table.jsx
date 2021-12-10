import { useTable } from 'react-table';
import MuiTable from '@material-ui/core/Table';
import { makeStyles } from '@material-ui/core/styles';
import { useTableProps } from 'hooks';

export const Table = ({
  columns,
  data,
  paginatable,
  children,
  sortable,
  updateMethods,
  initialState = {},
  selectable,
  ...props
}) => {
  const classes = useStyles();
  const [header, body, pages] = children;
  const tableProps = useTableProps({
    columns,
    data,
    initialState,
    selectable,
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
    <>
      <MuiTable {...methods.getTableProps()} {...props}>
        {header(headerMethods)}
        {body(bodyMethods)}
      </MuiTable>
      {pages && <div className={classes.pagination}>{pages(paginationMethods)}</div>}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '25vh',
  },
  pagination: { marginTop: theme.spacing(2) },
}));
