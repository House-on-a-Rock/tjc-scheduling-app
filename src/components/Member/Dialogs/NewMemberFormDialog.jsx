import React, { useState } from 'react';
import PropTypes from 'prop-types';

// material ui
import { makeStyles, createStyles } from '@material-ui/core/styles';

import { CustomDialog, FormField } from '../../shared';
import { EmailForm } from '../../FormControl';
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

  function submitMember(event) {
    event?.preventDefault();
    handleClick(ACCEPT, { firstName, lastName, email: email.value });
  }

  return (
    <CustomDialog
      open={open}
      title={title}
      label="New-Member"
      description={description}
      handleClose={() => handleClick(CLOSE)}
      handleSubmit={submitMember}
    >
      <FormField
        name="firstname"
        label="First Name"
        value={firstName}
        handleChange={setFirstName}
        autoFocus
      />
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
    </CustomDialog>
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
