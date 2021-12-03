import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid } from '@material-ui/core';

import { usePagination } from '@hooks';
import { PaginationSpread, PaginationPageSize, PaginationTextfield } from '.';

export const Pagination = ({
  methods,
  withInput = false,
  withPageSize = false,
  ...props
}) => {
  const classes = useStyles();
  const {
    gotoPage,
    state: { pageIndex, pageSize },
    pageOptions,
    setPageSize,
  } = methods;
  const pagination = usePagination({
    currentPage: pageIndex,
    pages: pageOptions,
    setPage: gotoPage,
    spreadSize: 7,
  });

  const secondaryComponents = (() => {
    const components = [];
    if (withPageSize)
      components.push(
        <PaginationPageSize pageSize={pageSize} setPageSize={setPageSize} />,
      );
    if (withInput)
      components.push(
        <PaginationTextfield currentPage={pageIndex} handlePageChange={pagination[1]} />,
      );
    return components;
  })();

  return (
    <Grid container {...props}>
      <Grid item xs={4} style={{}}>
        <PaginationSpread pagination={pagination} currentPage={pageIndex} />
      </Grid>
      <Grid item container xs={8} direction="row-reverse">
        {secondaryComponents.map((component, idx) => {
          return (
            <Grid item key={idx}>
              <Box className={classes.margin}>{component}</Box>
            </Grid>
          );
        })}
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles((theme) => ({ margin: { marginLeft: theme.spacing(2) } }));
