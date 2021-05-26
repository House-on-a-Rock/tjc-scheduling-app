import React from 'react';
import PropTypes from 'prop-types';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

// alert.status - 'error', 'info', 'warning', 'success'
// TODO create library of possible alert codes from backend
const alertStatus = {
  200: 'success',
  409: 'error',
  503: 'error',
};

const Alert = ({ alert, isOpen, handleClose }) => {
  // no res.response for success, no res.data for error
  // i'm just yeeting the response into this, makes it easier to just call setAlert(res) from every useMutation. Also, only have to change this one function if our response object changes
  const processedAlert = { message: '', status: '' };
  if (alert.data) {
    // is a success alert
    processedAlert.message = alert.data.message;
    processedAlert.status = alert.status;
  } else {
    processedAlert.message = alert.response.data.message;
    processedAlert.status = alert.response.data.status;
  }

  return (
    <Snackbar open={isOpen} autoHideDuration={2000} onClose={handleClose}>
      <MuiAlert
        elevation={6}
        variant="filled"
        severity={alertStatus[processedAlert.status]}
        onClose={handleClose}
      >
        {processedAlert.message}
      </MuiAlert>
    </Snackbar>
  );
};

Alert.propTypes = {
  alert: PropTypes.object,
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func,
};

export default Alert;
