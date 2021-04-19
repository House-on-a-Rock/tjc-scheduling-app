/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import TextField from '@material-ui/core/TextField';

export const ValidatedTextField = ({
  label,
  input,
  handleChange,
  ...props
}) => (
  <TextField
    variant="outlined"
    margin="normal"
    required
    fullWidth
    id={label}
    label={label}
    name={label}
    value={input.value}
    onChange={(event) => handleChange({ ...input, value: event.target.value })}
    error={!input.valid}
    helperText={input.valid ? '' : input.message}
    {...props}
  />
);
