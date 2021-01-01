import React from 'react';

// material ui
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { buttonTheme } from '../../shared/styles/theme';

export interface SimpleDialogProps {
  title: string;
  isOpen: boolean;
  handleClick: (shouldDelete: boolean) => void;
}

export function ConfirmationDialog({ handleClick, isOpen, title }: SimpleDialogProps) {
  const classes = useStyles();
  return (
    <Dialog onBackdropClick={() => handleClick(!isOpen)} open={isOpen}>
      <DialogTitle id="confirm-dialog">{title}</DialogTitle>
      <div className={classes.buttonBottomBar}>
        <Button onClick={() => handleClick(true)} className={classes.button}>
          Confirm
        </Button>
        <Button onClick={() => handleClick(false)} className={classes.button}>
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
    button: {
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
