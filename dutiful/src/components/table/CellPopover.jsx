import { Popover } from '@material-ui/core';
import { forwardRef } from 'react';

const defaultAnchorOrigin = { vertical: 'top', horizontal: 'left' };
const defaultTransformOrigin = { vertical: 'top', horizontal: 'left' };

export const CellPopover = forwardRef(
  (
    {
      handleClose,
      anchorOrigin = defaultAnchorOrigin,
      transformOrigin = defaultTransformOrigin,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <Popover
        anchorEl={ref.current}
        onClose={handleClose}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        {...props}
      >
        {children}
      </Popover>
    );
  },
);
