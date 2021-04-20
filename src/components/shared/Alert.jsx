import React from 'react';
import PropTypes from 'prop-types';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles, createStyles } from '@material-ui/core/styles';

const Alert = ({ alert, isOpen, handleClose }) => (
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

const useStyles = makeStyles(() =>
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

Alert.propTypes = {
  alert: PropTypes.object,
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func,
};

export default Alert;
