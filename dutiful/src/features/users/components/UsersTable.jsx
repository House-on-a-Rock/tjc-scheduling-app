import { useEffect, useMemo, useState } from 'react';
import { Grid } from '@material-ui/core';

import { useUsers } from '../apis/users';
import { defaultColumns } from './columns';
import { TableHeader, TableBody, Table } from 'components/table';
import { Pagination } from 'components/pagination';

export const UsersTable = ({ churchId }) => {
  const { data: users } = useUsers(churchId);
  const [data, setData] = useState();
  const columns = useMemo(() => defaultColumns, []);

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
              style={{ minHeight: '82vh', position: 'relative' }}
              updateMethods={{ updateMyData }}
            >
              {TableHeader}
              {TableBody}
              {pagination &&
                ((props) => (
                  <div style={{ position: 'absolute', bottom: 0 }}>
                    {
                      <Pagination
                        dataLength={100}
                        itemsPerPage={1}
                        pageSpreadMax={7}
                        {...props}
                      />
                    }
                  </div>
                ))}
              {/* {pagination &&
                ((props) => (
                  <div style={{ position: 'absolute', bottom: 0 }}>
                    <PaginatedButtonBar
                      dataLength={100}
                      itemsPerPage={1}
                      pageSpreadMax={7}
                      {...props}
                    />
                  </div>
                ))} */}
            </Table>
          )}
        </Grid>
        {/* <PaginatedButtonBar dataLength={100} itemsPerPage={1} pageSpreadMax={7} /> */}
        <Grid></Grid>
      </Grid>
      {/* CRUD/RequestAvailabilitiesDialog DIALOGS */}
    </div>
  );
};
