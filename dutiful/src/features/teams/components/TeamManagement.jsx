import { useEffect, useMemo, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';

import { TableHeader, TableBody, Table } from 'components/table';
import { Pagination } from 'components/pagination';
import { TabNavigation } from 'components/navigation';
import { constructEmptyRow, teamManagementColumns } from 'features/management';
import { useTeams } from '../apis';
import { DraggableUsersList } from 'features/users/components/DraggableUsersList';
import { DraggleProvider } from 'providers/draggableProvider';
import { useDnd } from '@hooks';
import { Droppable } from 'components/dnd';
import { useUsers } from 'features/users';
import { Button } from 'components/button';

export const TeamManagement = () => {
  const classes = useStyles();
  const [users, setUsers] = useState(null);
  const [teams, setTeams] = useState([{}]);
  const [step, setStep] = useState(0);
  const [appendingUsers, setAppendingUsers] = useState(false);

  const { data: teamsData } = useTeams(2);
  const { data: usersData } = useUsers(2, { enabled: appendingUsers });

  const [state, onDragEnd] = useDnd({ teams, users });

  const teamMates = teams[step].users;
  const pagination = teamMates?.length > 10;
  const columns = useMemo(() => teamManagementColumns, []);

  function toggleAppendUsers() {
    setAppendingUsers(!appendingUsers);
  }

  useEffect(() => {
    if (!teamsData) return;
    setTeams(
      teamsData.map((group) => {
        // TODO authorized roles can see teams- disable unauthorized tabs
        if (!!group.users.length) return group;
        return { ...group, users: constructEmptyRow(teamManagementColumns) };
      }),
    );
  }, [teamsData]);

  useEffect(() => {
    if (!usersData) return;
    setUsers(
      usersData
        .filter((user) => !!user.firstName && user.isVerified && !user.disabled)
        .map((user) => ({ ...user, id: user.userId })),
    );
  }, [usersData]);

  useEffect(() => {
    console.log(state);
  }, [state]);

  return (
    <div className={classes.root}>
      <Button onClick={toggleAppendUsers}>Append Users</Button>
      <Grid container className={classes.content} spacing={3}>
        <DraggleProvider drag onDragEnd={onDragEnd}>
          <Grid item xs={appendingUsers ? 8 : 12}>
            <Droppable droppableId="teams-table">
              {teamMates && (
                <Table
                  columns={columns}
                  data={teamMates}
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
                          className={classes.pagination}
                        />
                      ))}
                </Table>
              )}
            </Droppable>
          </Grid>

          {appendingUsers && (
            <Grid item xs={4}>
              <DraggableUsersList users={users} droppableId="draggable-users" />
            </Grid>
          )}
        </DraggleProvider>
      </Grid>
      <div className={classes.footer}>
        {teams && (
          <TabNavigation activeStep={step} setActiveStep={setStep} data={teams} />
        )}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: { width: '100%', display: 'flex', flexDirection: 'column' },
  content: {
    flexGrow: 1,
    height: '80vh',
    marginBottom: theme.spacing(3),
    overflow: 'scroll',
  },
  table: {},
  list: {},
  footer: { flexShrink: 0 },
}));
