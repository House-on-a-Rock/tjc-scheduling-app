import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { VisiblePassword } from './VisiblePassword';

const PasswordForm = ({ name, label, password, handlePassword }) => (
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
    autoComplete="current-password"
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

PasswordForm.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  password: PropTypes.object,
  handlePassword: PropTypes.func,
};

export default PasswordForm;
