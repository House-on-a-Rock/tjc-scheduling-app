import { Pill } from 'components/chip';
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
      <Pill ref={anchorRef} onClick={handleToggle} label={value} />
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
