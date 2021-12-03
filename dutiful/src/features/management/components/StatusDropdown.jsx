import { Button } from 'components/button';
import { Menu, MenuItem } from 'components/menu';
import { useMenuRef } from 'hooks/useMenuRef';

export const StatusDropdown = ({
  value,
  row: { index },
  column: { id },
  updateMyData,
}) => {
  const { open, anchorRef, handleClose, handleMenuItemClose, handleToggle } = useMenuRef({
    callback: updateData,
  });

  function updateData(val) {
    updateMyData(index, id, val);
  }

  return (
    <div>
      <Button ref={anchorRef} onClick={handleToggle}>
        {value}
      </Button>
      <Menu open={open} handleClose={handleClose} ref={anchorRef}>
        <MenuItem
          value="Active"
          onClick={handleMenuItemClose('Active')}
          disabled={value === 'Active'}
        >
          Active
        </MenuItem>
        <MenuItem
          value="Inactive"
          onClick={handleMenuItemClose('Inactive')}
          disabled={value === 'Inactive'}
        >
          Inactive
        </MenuItem>
      </Menu>
    </div>
  );
};
