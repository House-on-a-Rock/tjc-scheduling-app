import { useEffect, useMemo, useState } from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';

import { userManagementColumns } from 'features/management';
import { useUsers } from 'features/users/apis';
import { TableHeader, TableBody, Table } from 'components/table';
import { Pagination } from 'components/pagination';

export const UsersTable = ({ churchId }) => {
  const classes = useStyles();
  const { data } = useUsers(churchId);
  const [users, setUsers] = useState(null);
  const columns = useMemo(() => userManagementColumns, []);
  const pagination = true;

  function updateMyData(rowIndex, columnAccessor, value) {
    setUsers((oldUsers) =>
      oldUsers.map((row, index) => {
        if (index !== rowIndex) return row;
        return { ...row, [columnAccessor]: value };
      }),
    );
  }

  useEffect(() => {
    if (!data) return;
    setUsers(
      data
        .map((user) => ({
          ...user,
          verified: user.isVerified ? 'Yes' : 'No',
          active: !user.disabled ? 'Active' : 'Inactive',
          action: user.id,
          subRows: undefined,
        }))
        .filter((item) => !!item.firstName),
    );
  }, [data]);

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {users && (
            <Table
              columns={columns}
              data={users}
              paginatable={pagination}
              sortable
              updateMethods={{ updateMyData }}
            >
              {TableHeader}
              {TableBody}
              {pagination &&
                ((methods) => {
                  return (
                    (methods.pageOptions.length > 1 || methods.data.length > 20) && (
                      <Pagination
                        className={classes.pagination}
                        methods={methods}
                        withInput={methods.pageOptions.length > 5}
                        withPageSize={methods.data.length > 20}
                        initialPageSize={methods.data.length < 20 && 20}
                      />
                    )
                  );
                })}
            </Table>
          )}
        </Grid>
        <Grid></Grid>
      </Grid>
      {/* CRUD/RequestAvailabilitiesDialog DIALOGS */}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  pagination: { width: '98%' },
}));
