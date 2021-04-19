import React from 'react';

// material ui
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { buttonTheme } from '../../shared/styles/theme';

export interface SimpleDialogProps {
  title: string;
  state: boolean;
  handleClick: (shouldDelete: boolean) => void;
}

export function ConfirmationDialog({ handleClick, state, title }: SimpleDialogProps) {
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

const useStyles = makeStyles((theme: Theme) =>
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
