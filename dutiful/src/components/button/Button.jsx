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
      size = 'medium',
      isLoading = false,
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
        startIcon={!isLoading && props.startIcon}
        {...props}
      >
        {isLoading && <Spinner size="sm" className="text-current" />}
        <>{props.children}</> {!isLoading && endIcon}
      </MuiButton>
    );
  },
);
