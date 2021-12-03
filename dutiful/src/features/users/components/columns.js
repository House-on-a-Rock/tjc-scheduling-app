import { ButtonGroup } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from 'components/button';
import { Menu, MenuItem } from 'components/menu';
import { useEffect, useRef, useState } from 'react';

const SetStatus = ({ value, row: { index }, column: { id }, updateMyData }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const prevOpen = useRef(open);

  function handleToggle() {
    setOpen((prevOpen) => !prevOpen);
  }

  function handleClose(event) {
    if (anchorRef.current && anchorRef.current.contains(event?.target)) return;
    setOpen(false);
  }

  function handleMenuItemClose(value) {
    return (event) => {
      console.log('closing');
      updateMyData(index, id, value);
      handleClose(event);
    };
  }

  useEffect(() => {
    if (!!prevOpen.current && !open) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  return (
    <div>
      <Button ref={anchorRef} onClick={handleToggle}>
        {value}
      </Button>
      <Menu open={open} handleClose={handleMenuItemClose(value)} ref={anchorRef}>
        <MenuItem
          value="Active"
          onClick={handleMenuItemClose('Active')}
          disabled={value === 'Active'}
          className={classes.button}
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

// TODO add Access Level (admin)
export const defaultColumns = [
  { Header: 'First Name', accessor: 'firstName' },
  { Header: 'Last Name', accessor: 'lastName' },
  { Header: 'Email', accessor: 'email' },
  {
    Header: 'Status',
    accessor: 'active',
    Cell: SetStatus,
  },
  {
    Header: 'Email Verified',
    accessor: 'verified',
    Cell: ({ value }) => {
      return (
        <>
          {value} {value !== 'Yes' && <Button>Remind?</Button>}
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

const useStyles = makeStyles((theme) => ({
  button: {
    backgroundColor: theme.palette.background.paper,
  },
}));
