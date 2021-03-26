import React from 'react';
import TextField from '@material-ui/core/TextField';
import { EmailState } from '../../shared/types/models';

interface EmailFormProps {
  name: string;
  label: string;
  email: EmailState;
  handleEmail: (arg0: EmailState) => void;
}

export const EmailForm = ({
  name,
  label,
  email,
  handleEmail,
  ...props
}: EmailFormProps) => (
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
    helperText={email.valid ? '' : email.message}
    error={!email.valid}
    {...props}
  />
);
