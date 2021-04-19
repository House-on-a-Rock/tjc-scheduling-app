import React, { useState } from 'react';

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
import { makeStyles, createStyles } from '@material-ui/core/styles';

import { EmailForm } from '../FormControl';
import { FormField } from '../shared/FormField';
import { EmailState, NewUserData } from '../../shared/types';
import { isValidEmail } from '../../shared/utilities';

export interface NewMemberFormDialogProps {
  title: string;
  state: boolean;
  handleClose: () => void;
  handleSubmit: (args: NewUserData) => void;
}

// FormDialog is inherently tightly coupled
export function NewMemberFormDialog({
  handleSubmit,
  handleClose,
  state,
  title,
}: NewMemberFormDialogProps) {
  const classes = useStyles();
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<EmailState>({
    value: '',
    valid: true,
    message: null,
  });

  // validations needed
  // valid email provided
  // why are the submit/cancel buttons listitems?

  return (
    <Dialog onBackdropClick={() => handleClose()} open={state} className={classes.root}>
      <DialogTitle id="confirm-dialog">{title} </DialogTitle>
      <form noValidate autoComplete="off" className={classes.form}>
        <FormField
          name="firstname"
          label="First Name"
          value={firstName}
          handleChange={setFirstName}
          autoFocus
        />
        <br />
        <FormField
          name="lastname"
          label="Last Name"
          value={lastName}
          handleChange={setLastName}
        />
        <br />
        <EmailForm
          name="email"
          label="Email Address"
          email={email}
          handleEmail={setEmail}
        />
        <br />
      </form>
      <List>
        <ListItem
          button
          onClick={() => {
            if (isValidEmail(email.value)) {
              handleSubmit({ firstName, lastName, email: email.value });
            } else {
              setEmail({ ...email, valid: false, message: 'Invalid email' });
            }
          }}
          key="yes-button"
          className={classes.listItem}
        >
          <ListItemIcon style={{ color: green[500] }}>
            <CheckIcon />
          </ListItemIcon>
          <ListItemText primary="CONFIRM" />
        </ListItem>
        <ListItem
          button
          onClick={() => handleClose()}
          key="no-button"
          className={classes.listItem}
        >
          <ListItemIcon style={{ color: '#ba000d' }}>
            <ClearIcon />
          </ListItemIcon>
          <ListItemText primary="CANCEL" />
        </ListItem>
      </List>
    </Dialog>
  );
}

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      '& [role="dialog"]': {
        width: '300px',
      },
    },
    form: {
      '& > *': {
        margin: '8px',
        width: 'calc(100% - 8px * 2)',
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
