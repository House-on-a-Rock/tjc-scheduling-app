import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';

export const FormField = ({ name, label, value, handleChange, className, ...props }) => (
  <TextField
    variant="outlined"
    margin="normal"
    required
    fullWidth
    id={name}
    label={label}
    name={name}
    value={value}
    onChange={(event) => handleChange(event.target.value)}
    className={className}
    {...props}
  />
);
