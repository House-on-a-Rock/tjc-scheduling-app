import { Input, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { forwardRef } from 'react';

const useStyles = makeStyles(() => ({
  root: {},
  disabled: { backgroundColor: '#ECECEC', pointerEvents: 'none' },
  number: {
    '&[type=number]': {
      '-moz-appearance': 'textfield',
    },
    '&::-webkit-outer-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
    '&::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
  },
}));

export const Textfield = forwardRef(
  (
    {
      type = 'string',
      onEnter = null,
      value,
      setValue = null,
      variant = 'outlined',
      suffix = null,
      allowClear = true,
      onChange = null,
      disabled = false,
      InputProps = {},
      ...props
    },
    ref,
  ) => {
    const classes = useStyles({ disabled });

    function handleKeyPressEnter(event) {
      if (event.key === 'Enter') onEnter && onEnter(event);
    }

    const computedInputProps = (() => {
      let computedProps = { ...InputProps };
      if (type === 'number') {
        computedProps = {
          ...computedProps,
          className: clsx(computedProps.className, classes.number),
        };
      }
      return computedProps;
    })();

    return (
      <TextField
        variant={variant}
        fullWidth
        inputRef={ref}
        value={value}
        onChange={onChange}
        disabled={disabled}
        onKeyPress={handleKeyPressEnter}
        className={clsx(
          classes.root,
          disabled && classes.disabled,
          props.className && props.className,
        )}
        InputProps={computedInputProps}
        {...props}
      />
    );
  },
);
