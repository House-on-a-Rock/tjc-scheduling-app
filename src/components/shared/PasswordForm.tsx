import React from 'react';
import TextField from '@material-ui/core/TextField';
import { VisiblePassword } from './VisiblePassword';
import { PasswordState } from '../../shared/types/models';

interface PasswordFormProps {
  name: string;
  label: string;
  password: PasswordState;
  handlePassword: (arg0: PasswordState) => void;
}

export const PasswordForm = ({
  name,
  label,
  password,
  handlePassword,
}: PasswordFormProps) => (
  <TextField
    variant="outlined"
    margin="normal"
    required
    fullWidth
    value={password.value}
    onChange={(event) => handlePassword({ ...password, value: event.target.value })}
    id={name}
    label={label}
    name={name}
    type={password.visible ? 'text' : 'password'}
    helperText={password.valid ? '' : password.message}
    error={!password.valid}
    InputProps={{
      endAdornment: (
        <VisiblePassword
          data={password}
          handleVisible={(event) =>
            handlePassword({
              ...password,
              visible: event,
            })
          }
        />
      ),
    }}
  />
);
