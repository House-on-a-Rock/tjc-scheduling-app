import { forwardRef } from 'react';
import { MenuList, Popover } from '@material-ui/core';

const defaultAnchorOrigin = { vertical: 'bottom', horizontal: 'center' };
const defaultTransformOrigin = { vertical: 'top', horizontal: 'center' };

export const Menu = forwardRef(
  (
    {
      open,
      handleClose,
      children,
      anchorOrigin = defaultAnchorOrigin,
      transformOrigin = defaultTransformOrigin,
    },
    ref,
  ) => {
    function handleListKeyDown(event) {
      if (event.key === 'Tab') {
        event.preventDefault();
        handleClose();
      }
    }
    return (
      <Popover
        open={open}
        anchorEl={ref.current}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        onClose={handleClose}
      >
        <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
          {children}
        </MenuList>
      </Popover>
    );
  },
);
