import { useEffect, useMemo } from 'react';
import { makeStyles } from '@material-ui/styles';

import { TableHeader, TableBody, Table } from 'components/table';
import { Pagination } from 'components/pagination';
import { constructEmptyRow, teamManagementColumns } from 'features/management';
import { useTeammates } from '../apis';
import { useDnd } from 'lib/dnd';

// TODO pagination breaks when teammates length state change

export const TeamTable = ({ teamId }) => {
  const classes = useStyles();
  const columns = useMemo(() => teamManagementColumns, []);
  const { data } = useTeammates(teamId, {
    enabled: !!teamId,
    keepPreviousData: true,
  });
  const { state, bootstrapState } = useDnd();

  const pagination = state.teammates?.length > 10;

  useEffect(() => {
    if (!data) return;
    // TODO authorized roles can see teams- disable unauthorized tabs
    bootstrapState({
      teammates: data.length ? data : constructEmptyRow(teamManagementColumns),
    });
  }, [data]);

  return (
    <Table
      columns={columns}
      data={state.teammates}
      paginatable={pagination}
      initialState={{ pageSize: 15 }}
      className={classes.table}
    >
      {TableHeader}
      {TableBody}
      {pagination &&
        ((methods) =>
          (methods.pageOptions.length > 1 || methods.data.length > 20) && (
            <Pagination
              methods={methods}
              withInput={methods.pageOptions.length > 5}
              withPageSize={methods.data.length > 20}
            />
          ))}
    </Table>
  );
};

const useStyles = makeStyles((theme) => ({
  table: {},
}));
