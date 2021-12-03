/* eslint-disable react-hooks/exhaustive-deps */

import { Fragment } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Divider } from '@material-ui/core';

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
    if (withInput)
      components.push(
        <PaginationTextfield currentPage={pageIndex} handlePageChange={pagination[1]} />,
      );
    if (withPageSize)
      components.push(
        <PaginationPageSize pageSize={pageSize} setPageSize={setPageSize} />,
      );
    return components;
  })();

  return (
    <Box className={clsx(classes.root, props.className ?? '')}>
      <PaginationSpread pagination={pagination} currentPage={pageIndex} />
      {secondaryComponents.map((component, idx) => {
        return (
          <Fragment key={idx}>
            <Divider className={classes.margin} flexItem orientation="vertical" />
            <Box className={classes.margin}>{component} </Box>
          </Fragment>
        );
      })}
    </Box>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '2px 0',
  },
  margin: { marginLeft: theme.spacing(2) },
}));
