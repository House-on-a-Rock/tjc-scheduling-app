import { forwardRef } from 'react';
import { MenuList, Paper, Popover } from '@material-ui/core';

export const Menu = forwardRef(({ open, handleClose, children }, ref) => {
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
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      onClose={handleClose}
    >
      <Paper>
        <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
          {children}
        </MenuList>
      </Paper>
    </Popover>
  );
});
