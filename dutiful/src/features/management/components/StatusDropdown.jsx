import { Paper, makeStyles, Divider } from '@material-ui/core';
import { Pill } from 'components/chip';
import { CellPopover } from 'components/table';
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

  function handleDelete(val) {
    console.log(val);
  }

  return (
    <div>
      <Pill ref={anchorRef} onClick={handleToggle} label={value} />
      <CellPopover open={open} handleClose={handleClose} ref={anchorRef}>
        <Paper style={{ width: '100px' }}>
          <div style={{ padding: '8px' }}>
            <Pill
              label="Active"
              onClick={handleMenuItemClose('Active')}
              onDelete={handleDelete}
              // disabled={value === 'Active'}
            />
          </div>
          <Divider />
          <div style={{ padding: '8px' }}>
            <Pill
              label="Active"
              onClick={handleMenuItemClose('Active')}
              onDelete={handleDelete}
              // disabled={value === 'Active'}
            />
            <div style={{ marginBottom: '8px' }} />
            <Pill
              label="Active"
              onClick={handleMenuItemClose('Active')}
              onDelete={handleDelete}
              // disabled={value === 'Active'}
            />
          </div>
        </Paper>
        {/* <MenuItem
          // value="Active"
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
        </MenuItem> */}
      </CellPopover>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  pill: {},
}));
