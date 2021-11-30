import { ButtonGroup, Menu, MenuItem } from '@material-ui/core';
import { Button } from 'components/button';
import { useState } from 'react';

const SetActive = ({ value, row: { index }, column: { id }, updateMyData }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (itemValue) => {
    return () => {
      updateMyData(index, id, itemValue);
      setAnchorEl(null);
    };
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls="basic-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        {value}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem
          value="Active"
          onClick={handleClose('Active')}
          disabled={value === 'Active'}
        >
          Active
        </MenuItem>
        <MenuItem
          value="Inactive"
          onClick={handleClose('Inactive')}
          disabled={value === 'Inactive'}
        >
          Inactive
        </MenuItem>
      </Menu>
    </div>
  );
};

// TODO add Access Level (admin)
export const defaultColumns = [
  { Header: 'First Name', accessor: 'firstName' },
  { Header: 'Last Name', accessor: 'lastName' },
  { Header: 'Email', accessor: 'email' },
  {
    Header: 'Status',
    accessor: 'active',
    Cell: SetActive,
  },
  {
    Header: 'Email Verified',
    accessor: 'verified',
    Cell: ({ value }) => {
      return (
        <>
          {value} {value !== 'Yes' && <button>Remind?</button>}
        </>
      );
    },
  },
  {
    Header: 'Action',
    accessor: 'action',
    Cell: (item) => (
      <ButtonGroup variant="outlined" size="small">
        <Button onClick={() => console.log(item)}>Edit</Button>
        <Button onClick={() => console.log(item.value)}>Delete</Button>
      </ButtonGroup>
    ),
  },
];
