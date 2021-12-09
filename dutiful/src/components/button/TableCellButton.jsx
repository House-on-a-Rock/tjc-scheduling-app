import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { forwardRef } from 'react';
import { Button } from '.';

export const TableCellButton = forwardRef(
  ({ className = '', children, ...props }, ref) => {
    const classes = useStyles();
    return (
      <Button ref={ref} className={clsx(classes.root, className)} {...props}>
        {children}
      </Button>
    );
  },
);

const useStyles = makeStyles((theme) => ({
  root: {
    height: theme.spacing(4),
  },
}));
