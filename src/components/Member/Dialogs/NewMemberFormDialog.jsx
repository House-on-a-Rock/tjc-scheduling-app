import React, { useState } from 'react';
import PropTypes from 'prop-types';

// material ui
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  DialogContentText,
  Typography,
} from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import { EmailForm } from '../../FormControl';
import FormField from '../../shared/FormField';
import { buttonTheme } from '../../../shared/styles/theme';

const ACCEPT = 'ACCEPT';
const CLOSE = 'CLOSE';

const NewMemberFormDialog = ({ handleClick, open, title, description }) => {
  const classes = useStyles();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState({
    value: '',
    valid: true,
    message: null,
  });

  return (
    <Dialog
      onBackdropClick={() => handleClick(CLOSE)}
      open={open}
      className={classes.root}
    >
      <DialogTitle id="confirm-dialog">{title} </DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
        <form noValidate autoComplete="off" className={classes.form}>
          {/* <ValidatedTextField
          label="Deadline"
          input={deadline}
          handleChange={setDeadline}
          type="date"
          /> */}
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
      </DialogContent>
      <DialogActions>
        <Button
          // onClick={() => handleClick(ACCEPT)}
          className={classes.confirmButton}
        >
          Confirm
        </Button>
        <Button onClick={() => handleClick(CLOSE)} className={classes.cancelButton}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const useStyles = makeStyles(() =>
  createStyles({
    root: {},
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
  }),
);
NewMemberFormDialog.propTypes = {
  handleClick: PropTypes.func,
  open: PropTypes.bool,
  title: PropTypes.string,
  description: PropTypes.string,
};

export default NewMemberFormDialog;
