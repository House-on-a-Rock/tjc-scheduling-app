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
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import { EmailForm, PasswordForm } from '../FormControl';
import { FormField } from './FormField';
import { EmailState, PasswordState } from '../../shared/types/models';
import { isValidEmail } from '../../shared/utilities';

export interface AddUserProps {
  title: string;
  isOpen: boolean;
  handleClose: (
    value: boolean,
    firstname: string,
    lastname: string,
    email: string,
    password: string,
  ) => void;
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

export function FormDialog({ handleClose, isOpen, title }: AddUserProps) {
  const classes = useStyles();
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<EmailState>({
    value: '',
    valid: true,
    message: null,
  });
  const [password, setPassword] = useState<PasswordState>({
    value: '',
    valid: true,
    visible: false,
    message: null,
  });

  const clearPresets = () => {
    setEmail({ ...email, valid: true, value: '', message: null });
    setFirstName('');
    setLastName('');
    setPassword({ ...password, value: '' });
  };

  // validations needed
  // valid email provided
  // why are the submit/cancel buttons listitems?

  return (
    <Dialog
      onBackdropClick={() => {
        handleClose(!isOpen, firstName, lastName, email.value, password.value);
        clearPresets();
      }}
      open={isOpen}
      className={classes.root}
    >
      <DialogTitle id="confirm-dialog">{title} </DialogTitle>
      <form noValidate autoComplete="off" className={classes.form}>
        <FormField
          name="firstname"
          label="First Name"
          value={firstName}
          handleChange={setFirstName}
        />
        <br />
        <FormField
          name="firstname"
          label="First Name"
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
        <PasswordForm
          name="Password"
          label="Password"
          password={password}
          handlePassword={setPassword}
        />
      </form>
      <List>
        <ListItem
          button
          onClick={() => {
            if (isValidEmail(email.value)) {
              handleClose(true, firstName, lastName, email.value, password.value);
              clearPresets();
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
          onClick={() => {
            handleClose(false, firstName, lastName, email.value, password.value);
            clearPresets();
          }}
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
