import React from 'react';
import PropTypes from 'prop-types';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

// alert.status - 'error', 'info', 'warning', 'success'
// TODO create library of possible alert codes from backend
const alertStatus = {
  200: 'success',
  503: 'error',
};

export const sendAlert = (res) => {
  return { status: alertStatus[res.status], message: res.data };
};

export const Alert = ({ alert, isOpen, handleClose }) => (
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

Alert.propTypes = {
  alert: PropTypes.object,
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func,
};
