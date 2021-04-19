import React from 'react';
import TextField from '@material-ui/core/TextField';

export const EmailForm = ({ name, label, email, handleEmail }) => (
  <TextField
    variant="outlined"
    margin="normal"
    required
    fullWidth
    id={name}
    label={label}
    name={name}
    value={email.value}
    onChange={(event) => handleEmail({ ...email, value: event.target.value })}
    autoComplete="email"
    autoFocus
    helperText={email.valid ? '' : email.message}
    error={!email.valid}
  />
);
