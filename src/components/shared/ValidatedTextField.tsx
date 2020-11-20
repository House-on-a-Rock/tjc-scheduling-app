/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import { TextFieldState } from '../../shared/types/models';

interface ValidatedTextField {
  label: string;
  input: TextFieldState;
  handleChange: (input: TextFieldState) => void;
  [x: string]: any;
}

export const createTextFieldState = (value: string): TextFieldState => ({
  value: value,
  message: '',
  valid: true,
});

export const constructError = (
  condition: boolean,
  message: string,
  state: TextFieldState,
  setStateCallback: React.Dispatch<React.SetStateAction<TextFieldState>>,
) => {
  if (condition)
    setStateCallback({
      ...state,
      valid: false,
      message: message,
    });
};

export const ValidatedTextField = ({
  label,
  input,
  handleChange,
  ...extraProps
}: ValidatedTextField) => (
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
    // className={className}
    error={!input.valid}
    helperText={input.valid ? '' : input.message}
    {...extraProps}
  />
);
