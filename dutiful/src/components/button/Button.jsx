import clsx from 'clsx';
import { Spinner } from 'components/loading';
import * as React from 'react';
import { Button as MuiButton } from '@material-ui/core';

export const Button = React.forwardRef(
  (
    {
      type = 'button',
      className = '',
      variant = 'outlined',
      size = 'md',
      isLoading = false,
      startIcon,
      endIcon,
      ...props
    },
    ref,
  ) => {
    return (
      <MuiButton
        ref={ref}
        variant={variant}
        type={type}
        className={clsx(className)}
        {...props}
      >
        {isLoading && <Spinner size="sm" className="text-current" />}
        {!isLoading && startIcon}
        <span>{props.children}</span> {!isLoading && endIcon}
      </MuiButton>
    );
  },
);

Button.displayName = 'Button';
