import { useEffect, useMemo, useState } from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';

import { useUsers } from '../apis/users';
import { defaultColumns } from './columns';
import { TableHeader, TableBody, Table } from 'components/table';
import { Pagination } from 'components/pagination';

export const UsersTable = ({ churchId }) => {
  const classes = useStyles();
  const { data: users } = useUsers(churchId);
  const [data, setData] = useState();
  const columns = useMemo(() => defaultColumns, []);
  const largeData = data && [
    ...data,
    ...data,
    ...data,
    ...data,
    ...data,
    ...data,
    ...data,
    ...data,
    ...data,
  ];

  const pagination = true;

  function updateMyData(rowIndex, columnAccessor, value) {
    setData((oldData) =>
      oldData.map((row, index) => {
        if (index !== rowIndex) return row;
        return { ...row, [columnAccessor]: value };
      }),
    );
  }

  useEffect(() => {
    if (users)
      setData(
        users
          ?.map((user) => ({
            ...user,
            verified: user.isVerified ? 'Yes' : 'No',
            active: !user.disabled ? 'Active' : 'Inactive',
            action: user.id,
            subRows: undefined,
          }))
          .filter((item) => !!item.firstName),
      );
  }, [users]);

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {data && (
            <Table
              columns={columns}
              data={largeData}
              paginatable={pagination}
              sortable
              className={classes.table}
              updateMethods={{ updateMyData }}
            >
              {TableHeader}
              {TableBody}
              {pagination &&
                ((methods) => {
                  return (
                    methods.pageOptions.length > 1 && (
                      <Pagination
                        methods={methods}
                        withInput={methods.pageOptions.length > 5}
                        withPageSize={methods.data.length > 20}
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
  table: {
    minHeight: '82vh',
    position: 'relative',
  },
  pagination: {
    position: 'absolute',
    bottom: 0,
  },
}));
