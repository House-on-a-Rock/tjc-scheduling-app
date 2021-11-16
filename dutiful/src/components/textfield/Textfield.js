import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { forwardRef } from 'react';

const useStyles = makeStyles(() => ({
  root: (props) => ({
    pointerEvents: props.disabled && 'none',
  }),
  disabled: {
    backgroundColor: '#ECECEC',
  },
}));

export const Textfield = forwardRef(
  (
    {
      InputProps,
      onEnter = null,
      value,
      setValue = null,
      variant = 'outlined',
      suffix = null,
      allowClear = true,
      onChange = null,
      disabled = false,
      ...props
    },
    ref,
  ) => {
    const classes = useStyles({ disabled });

    const handleKeyPressEnter = (event) => {
      if (event.key === 'Enter') {
        onEnter && onEnter(event);
      }
    };

    return (
      <TextField
        variant={variant}
        fullWidth
        inputRef={ref}
        value={value}
        onChange={onChange}
        disabled={disabled}
        onKeyPress={handleKeyPressEnter}
        InputProps={{ ...InputProps, classes: { disabled: classes.disabled } }}
        className={classes.root}
        {...props}
      />
    );
  },
);
