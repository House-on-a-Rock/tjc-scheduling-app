import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';

const FormField = ({ name, label, value, handleChange, className, ...props }) => (
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

FormField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  handleChange: PropTypes.func,
  className: PropTypes.any,
};

export default FormField;
