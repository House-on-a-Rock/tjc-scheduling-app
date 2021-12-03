/* eslint-disable react-hooks/exhaustive-deps */

import { makeStyles } from '@material-ui/core/styles';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

import { PAGE_INDEX, SPREAD } from 'constants/pagination';
import { Button } from 'components/button';
import clsx from 'clsx';

export const PaginationSpread = ({ pagination, currentPage }) => {
  const classes = useStyles();
  const [spread, handlePageChange, canPreviousPage, canNextPage] = pagination;
  console.log({ canPreviousPage });

  return (
    <div className={classes.pagination}>
      <Button
        className={clsx(classes.button, classes.icon)}
        variant="text"
        onClick={handlePageChange(currentPage - 1)}
        disabled={!canPreviousPage}
      >
        <ArrowBackIcon
          color={!canPreviousPage ? 'disabled' : 'action'}
          fontSize="small"
        />
      </Button>
      {spread.map(({ value, type }) => {
        const selected = type === PAGE_INDEX && value === currentPage;
        return (
          <Button
            key={`paginated-buttons-${value}`}
            className={clsx(
              classes.button,
              classes.innerButtons,
              type === SPREAD && classes.icon,
              type === PAGE_INDEX && classes.text,
              selected && classes.selected,
            )}
            variant="text"
            onClick={handlePageChange(value, type)}
          >
            {type === SPREAD ? <MoreHorizIcon color="action" /> : value + 1}
          </Button>
        );
      })}
      <Button
        className={clsx(classes.button, classes.icon)}
        variant="text"
        onClick={handlePageChange(currentPage + 1)}
        disabled={!canNextPage}
      >
        <ArrowForwardIcon color={!canNextPage ? 'disabled' : 'action'} fontSize="small" />
      </Button>
    </div>
  );
};
const useStyles = makeStyles((theme) => ({
  pagination: { width: 'fit-content', display: 'flex', flexDirection: 'row' },
  button: {
    maxWidth: theme.spacing(4.5),
    maxHeight: theme.spacing(4),
    minWidth: theme.spacing(4),
    minHeight: theme.spacing(4),
  },
  innerButtons: { maxHeight: theme.spacing(4), maxWidth: theme.spacing(3.5) },
  text: { fontSize: theme.typography.htmlFontSize },
  selected: { backgroundColor: theme.palette.grey[200] },
  icon: { paddingTop: theme.spacing(1.5) },
}));
