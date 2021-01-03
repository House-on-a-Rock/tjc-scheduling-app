import React from 'react';
import TextField from '@material-ui/core/TextField';

interface FormFieldProps {
  name: string;
  label: string;
  value: string;
  className?: string;
  handleChange: (value: string) => void;
  [x: string]: any;
}

export const FormField = ({
  name,
  label,
  value,
  handleChange,
  className,
  ...props
}: FormFieldProps) => (
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
