import React, { useEffect } from 'react';

import { Alert as MuIAlert, Color } from '@material-ui/lab';
import CheckIcon from '@material-ui/icons/Check';
import ErrorIcon from '@material-ui/icons/Error';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

export interface AlertProps {
  alert: { message: string; status: string };
  unMountAlert: () => void;
}

export const Alert = ({ alert, unMountAlert }: AlertProps) => {
  const classes = useStyles();
  const displayTimer = 2000;

  useEffect(() => {
    setTimeout(unMountAlert, displayTimer); // unmount after 2 seconds
  });
  // only success has been implemented, since error is handled inside each form. But we'll pbly run into use cases for the error alert
  const muiAlertProps: { icon: JSX.Element; severity: Color } =
    alert.status === 'success'
      ? { severity: 'success', icon: <CheckIcon fontSize="inherit" /> }
      : { severity: 'error', icon: <ErrorIcon fontSize="inherit" /> };

  return (
    <MuIAlert
      icon={muiAlertProps.icon}
      severity={muiAlertProps.severity}
      className={classes.root}
      variant="filled"
    >
      {alert.message}
    </MuIAlert>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    // transition animations?
    root: {
      position: 'fixed',
      width: '95%',
      height: 33,
      top: 20,
      left: 20,
      right: 20,
      zIndex: 100000, // too much?
      padding: 2,
      transform: 'translateY(-100vh)',
      animation: `slide-in-from-top 0.5s forwards`,
    },
  }),
);
