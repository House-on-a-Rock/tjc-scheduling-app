/* eslint-disable react-hooks/exhaustive-deps */

import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { usePagination } from '@hooks';

import { PAGE_INDEX, SPREAD } from 'constants/pagination';
import { Button } from 'components/button';
import clsx from 'clsx';

export const Pagination = ({
  gotoPage,
  canPreviousPage,
  previousPage,
  canNextPage,
  nextPage,
  state: { pageIndex, pageSize },
  pageOptions,
  setPageSize,
}) => {
  const classes = useStyles();
  const [pagination, onPageSelect] = usePagination({
    currentPage: pageIndex,
    pages: pageOptions,
    setPage: gotoPage,
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <Grid container className={classes.pagination}>
        <Button
          variant="text"
          className={classes.button}
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          <ArrowBackIcon color={!canPreviousPage ? 'disabled' : 'action'} />
        </Button>
        {pagination.map(({ value, type }) => {
          const selected = type === PAGE_INDEX && value === pageIndex;
          return (
            <Button
              key={`paginated-buttons-${value}`}
              className={clsx(classes.innerbuttons, selected && classes.selected)}
              variant="text"
              onClick={onPageSelect(value, type)}
            >
              {type === SPREAD ? <MoreHorizIcon color="action" /> : value + 1}
            </Button>
          );
        })}
        <Button
          className={classes.button}
          variant="text"
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          <ArrowForwardIcon color={!canNextPage ? 'disabled' : 'action'} />
        </Button>
      </Grid>
      <span>
        | Go to page:
        <input
          type="number"
          defaultValue={pageIndex + 1}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0;
            gotoPage(page);
          }}
          style={{ width: '100px' }}
        />
      </span>
      <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
        {[10, 20, 30, 40, 50].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </select>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  pagination: { width: 'fit-content' },
  innerbuttons: {
    maxHeight: theme.spacing(4),
    minWidth: theme.spacing(4),
    minHeight: theme.spacing(4),
  },
  button: {
    maxWidth: theme.spacing(5),
    maxHeight: theme.spacing(4),
    minWidth: theme.spacing(5),
    minHeight: theme.spacing(4),
  },
  selected: { backgroundColor: theme.palette.grey[300] },
}));
