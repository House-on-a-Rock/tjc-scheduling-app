import { useMemo } from 'react';
import { Grid } from '@material-ui/core';
import { Table } from 'components/table';
import { useUsers } from '../apis/users';
import { defaultColumns } from './columns';

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
