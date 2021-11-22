import { MenuItem, Select } from '@material-ui/core';

export const defaultColumns = [
  { Header: 'First Name', accessor: 'firstName' },
  { Header: 'Last Name', accessor: 'lastName' },
  { Header: 'Email', accessor: 'email' },
  {
    Header: 'Active',
    accessor: 'active',
    Cell: ({ value }) => {
      return (
        <Select value={value} variant="outlined">
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </Select>
      );
    },
  },
  {
    Header: 'Verified',
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
      <>
        <button onClick={() => console.log(item)}>Edit</button>
        <button onClick={() => console.log(item.value)}>Delete</button>
      </>
    ),
  },
];
