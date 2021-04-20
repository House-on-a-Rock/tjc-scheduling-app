import React from 'react';
import PropTypes from 'prop-types';

// material ui
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { buttonTheme } from '../../shared/styles/theme';

function ConfirmationDialog({ handleClick, state, title }) {
  const classes = useStyles();
  return (
    <Dialog onBackdropClick={() => handleClick(!state)} open={state}>
      <DialogTitle id="confirm-dialog">{title}</DialogTitle>
      <div className={classes.buttonBottomBar}>
        <Button onClick={() => handleClick(true)} className={classes.confirmButton}>
          Confirm
        </Button>
        <Button onClick={() => handleClick(false)} className={classes.cancelButton}>
          Cancel
        </Button>
      </div>
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
  state: PropTypes.bool,
  title: PropTypes.string,
};

export default ConfirmationDialog;
