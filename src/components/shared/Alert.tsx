import React, { useEffect } from 'react';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

export interface CustomSnackbarProps {
  alert: { message: string; status: string };
  isOpen: boolean;
  handleClose: () => void;
}

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export const CustomSnackbar = ({ alert, isOpen, handleClose }: CustomSnackbarProps) => {
  return (
    <Snackbar open={isOpen} autoHideDuration={2000} onClose={handleClose}>
      <Alert
        severity={alert.status === 'success' ? 'success' : 'error'}
        onClose={handleClose}
      >
        {alert.message}
      </Alert>
    </Snackbar>
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
      zIndex: 1000000, // too much?
      padding: 2,
      animation: `slide-in-from-top 0.5s forwards`,
    },
  }),
);
