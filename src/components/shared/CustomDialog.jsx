import React from 'react';
import PropTypes from 'prop-types';

// material ui
import {
  Button,
  DialogContent,
  DialogTitle,
  Dialog,
  DialogActions,
  DialogContentText,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';

import { buttonTheme } from '../../shared/styles/theme';

function CustomDialog({
  open,
  children,
  title = '',
  warningText = '',
  label = '',
  description = '',
  handleClose,
  handleSubmit,
}) {
  const classes = useStyles();

  return (
    <Dialog onBackdropClick={handleClose} open={open}>
      <DialogTitle id="confirm-dialog">{title}</DialogTitle>
      <form autoComplete="off" className={classes.form}>
        <DialogContent>
          <DialogContentText>{description}</DialogContentText>
          {warningText && (
            <Alert severity="warning" id={`${label} -warning`}>
              {warningText}
            </Alert>
          )}
          {children}
        </DialogContent>
        <DialogActions>
          <Button className={classes.confirmButton} onClick={handleSubmit} type="submit">
            Confirm
          </Button>
          <Button onClick={handleClose} className={classes.cancelButton}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

const useStyles = makeStyles((theme) => ({
  form: {},
  confirmButton: {
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    margin: '5px',
    ...buttonTheme.warning,
  },
  cancelButton: {
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    margin: '5px',
    '&:hover, &:focus': {
      ...buttonTheme.filled,
    },
  },
}));

CustomDialog.propTypes = {
  handleClose: PropTypes.func,
  handleSubmit: PropTypes.func,
  open: PropTypes.bool,
  title: PropTypes.string,
  label: PropTypes.string,
  description: PropTypes.string,
  form: PropTypes.bool,
  warningText: PropTypes.string,
  children: PropTypes.node,
};

export default CustomDialog;
