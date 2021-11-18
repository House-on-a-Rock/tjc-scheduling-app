import { Grid, makeStyles, MenuItem, Select } from '@material-ui/core';
import { Table } from 'components/table';
import { useMemo } from 'react';
import { useUsers } from '../apis/users';

// TODO add guests

export const UsersTable = ({ churchId }) => {
  const { data: users } = useUsers(churchId);
  const columns = useMemo(
    () => [
      {
        Header: 'Users',
        columns: [
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
        ],
      },
    ],
    [],
  );
  const data = users
    ?.map((user) => ({
      ...user,
      verified: user.isVerified ? 'Yes' : 'No',
      active: !user.disabled ? 'Yes' : 'No',
      action: user.id,
      subRows: undefined,
    }))
    .filter((item) => !!item.firstName);

  return (
    <div className={''}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {data && <Table columns={columns} data={data} />}
        </Grid>
      </Grid>
      {/* CRUD/RequestAvailabilitiesDialog DIALOGS */}
    </div>
  );
};

const useStyles = makeStyles(() => ({}));
