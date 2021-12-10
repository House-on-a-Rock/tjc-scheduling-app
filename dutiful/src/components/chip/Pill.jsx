import { forwardRef } from 'react';
import { Chip, makeStyles } from '@material-ui/core';
import clsx from 'clsx';

export const Pill = forwardRef(({ className, ...props }, ref) => {
  const classes = useStyles();
  return <Chip className={clsx(className, classes.pill)} ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  pill: {
    borderRadius: theme.spacing(0.5),
    height: 'fit-content',
    paddingTop: theme.spacing(0.25),
    paddingBottom: theme.spacing(0.25),
  },
}));
