import { forwardRef } from 'react';
import { Chip, makeStyles } from '@material-ui/core';
import clsx from 'clsx';

export const Pill = forwardRef(({ className = '', ...props }, ref) => {
  const classes = useStyles();
  const isDefault = !className || !props.variant;

  return (
    <Chip
      classes={{ root: classes.pill }}
      className={clsx(classes.root, isDefault && classes.defaultStyle, className)}
      ref={ref}
      {...props}
    />
  );
});

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: theme.spacing(0.5),
    height: 'fit-content',
    paddingTop: theme.spacing(0.25),
    paddingBottom: theme.spacing(0.25),
  },
  defaultStyle: {
    color: 'white',
    backgroundColor: theme.palette.primary.light,
  },
  pill: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
}));
