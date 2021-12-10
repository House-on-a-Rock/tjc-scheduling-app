import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { Pill } from 'components/chip';
import { forwardRef } from 'react';

export const PillButton = forwardRef(({ className = '', ...props }, ref) => {
  const classes = useStyles();
  return (
    <Pill
      ref={ref}
      variant="outlined"
      color="primary"
      className={clsx(classes.root, className)}
      {...props}
    />
  );
});

const useStyles = makeStyles((theme) => ({
  root: {},
}));
