import { useMemo } from 'react';
import { Grid } from '@material-ui/core';

import { useUsers } from '../apis/users';
import { defaultColumns } from './columns';
import { TableHeader, TableBody, Table } from 'components/table';
import { Pagination } from 'components/pagination';

export const UsersTable = ({ churchId }) => {
  const { data: users } = useUsers(churchId);
  const columns = useMemo(() => [{ Header: 'Users', columns: defaultColumns }], []);
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
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {data && (
            <Table columns={columns} data={data}>
              {({ headerGroups }) => <TableHeader headerGroups={headerGroups} />}
              {({ page, prepareRow }) => (
                <TableBody page={page} prepareRow={prepareRow} />
              )}
              {(methods) => <Pagination methods={methods} />}
            </Table>
          )}
        </Grid>
        <Grid></Grid>
      </Grid>
      {/* CRUD/RequestAvailabilitiesDialog DIALOGS */}
    </div>
  );
};
