import React, { useEffect } from 'react';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps, Color } from '@material-ui/lab/Alert';

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

export interface CustomSnackbarProps {
  alert: { message: string; status: Color };
  isOpen: boolean;
  handleClose: () => void;
}

export const Alert = ({ alert, isOpen, handleClose }: CustomSnackbarProps) => {
  return (
    <Snackbar open={isOpen} autoHideDuration={2000} onClose={handleClose}>
      <MuiAlert
        elevation={6}
        variant="filled"
        severity={alert.status}
        onClose={handleClose}
      >
        {alert.message}
      </MuiAlert>
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
      zIndex: 100000, // too much?
      padding: 2,
      animation: `slide-in-from-top 0.5s forwards`,
    },
  }),
);
