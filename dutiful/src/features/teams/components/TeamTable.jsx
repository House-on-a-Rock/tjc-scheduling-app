import { useEffect, useMemo } from 'react';
import { makeStyles } from '@material-ui/styles';
import AddIcon from '@material-ui/icons/Add';

import { Droppable } from 'components/dnd';
import { Button } from 'components/button';
import { TableHeader, TableBody, Table } from 'components/table';
import { Pagination } from 'components/pagination';
import { constructEmptyRow, teamManagementColumns } from 'features/management';
import { useDnd } from 'lib/dnd';
import { TEAMMATES, useTeammates } from '../apis';

// TODO pagination breaks when teammates length state change

export const TeamTable = ({ teamId, toggleAppendUsers }) => {
  const classes = useStyles();
  const columns = useMemo(() => teamManagementColumns, []);
  const { state, bootstrapState, bootstrapConfig } = useDnd();
  const { data } = useTeammates(teamId, { enabled: !!teamId, keepPreviousData: true });

  const pagination = state[TEAMMATES]?.length > 10;

  useEffect(() => {
    if (!data) return;
    // TODO authorized roles can see teams- disable unauthorized tabs
    bootstrapState({
      [TEAMMATES]: data.length ? data : constructEmptyRow(teamManagementColumns),
    });
    bootstrapConfig(TEAMMATES, {
      fixed: true,
      template: { firstName: '', lastName: '', teamLead: false, userId: null },
    });
  }, [data]);

  return (
    <Droppable
      droppableId={TEAMMATES}
      droppable
      draggable={false}
      className={classes.paper}
    >
      <div>
        <div className={classes.toolbar}>
          <Button onClick={toggleAppendUsers} startIcon={<AddIcon />}>
            Add Users
          </Button>
        </div>
        <Table
          columns={columns}
          data={state[TEAMMATES]}
          paginatable={pagination}
          initialState={{ pageSize: 15 }}
          className={classes.table}
        >
          {(methods) => {
            console.log(methods);
            return <TableHeader {...methods} />;
          }}
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
      </div>
    </Droppable>
  );
};

const useStyles = makeStyles((theme) => ({
  table: {},
  toolbar: { display: 'flex', flexDirection: 'row-reverse' },
  paper: { padding: theme.spacing(2) },
}));
