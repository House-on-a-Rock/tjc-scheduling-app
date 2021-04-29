import React from 'react';
import PropTypes from 'prop-types';

// material ui
import {
  Button,
  DialogContent,
  DialogTitle,
  Dialog,
  DialogActions,
} from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';

import { buttonTheme } from '../../shared/styles/theme';

const ACCEPT = 'ACCEPT';
const CLOSE = 'CLOSE';

function ConfirmationDialog({
  handleClick,
  open,
  title = '',
  warning = false,
  warningText = '',
}) {
  const classes = useStyles();

  return (
    <Dialog onBackdropClick={() => handleClick(CLOSE)} open={open}>
      <DialogTitle id="confirm-dialog">{title}</DialogTitle>
      <DialogContent>
        {warning && (
          <Alert severity="warning" id="delete-slide-warning-description">
            {warningText}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClick(ACCEPT)} className={classes.confirmButton}>
          Confirm
        </Button>
        <Button onClick={() => handleClick(CLOSE)} className={classes.cancelButton}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      '& [role="dialog"]': {
        width: '40%',
        maxWidth: '600px',
        minWidth: '300px',
      },
    },
    listItem: {
      width: '50%',
      margin: 'auto',
      '& > *': {
        display: 'flex',
        flex: 1,
        justifyContent: 'flex-start',
      },
    },
    buttonBottomBar: {
      minHeight: 'unset',
      flexWrap: 'wrap',
      alignSelf: 'end',
    },
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
  }),
);
ConfirmationDialog.propTypes = {
  handleClick: PropTypes.func,
  open: PropTypes.bool,
  title: PropTypes.string,
  warning: PropTypes.bool,
  warningText: PropTypes.string,
};

export default ConfirmationDialog;
