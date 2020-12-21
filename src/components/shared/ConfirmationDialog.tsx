import React from 'react';

// material ui
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import { green } from '@material-ui/core/colors';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

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
      <List>
        <ListItem
          button
          onClick={() => handleClick(true)}
          key="yes-button"
          className={classes.listItem}
        >
          <ListItemIcon style={{ color: green[500] }}>
            <CheckIcon />
          </ListItemIcon>
          <ListItemText primary="YES" />
        </ListItem>
        <ListItem
          button
          onClick={() => handleClick(false)}
          key="no-button"
          className={classes.listItem}
        >
          <ListItemIcon style={{ color: '#ba000d' }}>
            <ClearIcon />
          </ListItemIcon>
          <ListItemText primary="NO" />
        </ListItem>
      </List>
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
  }),
);
