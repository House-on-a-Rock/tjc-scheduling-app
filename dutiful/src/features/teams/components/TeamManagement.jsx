import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';

import { UsersBank } from 'features/users/components';
import { TabNavigation } from 'components/navigation';
import { Droppable } from 'components/dnd';
import { Button } from 'components/button';
import { DndProvider } from 'lib/dnd';

import { TeamTable } from './TeamTable';
import { TEAMMATES, useTeams } from '../apis';
import { USERS } from 'features/users';

export const TeamManagement = () => {
  const classes = useStyles();

  const [teams, setTeams] = useState([]);
  const [step, setStep] = useState(0);
  const { data } = useTeams(2);
  const [appendingUsers, setAppendingUsers] = useState(true);

  function toggleAppendUsers() {
    setAppendingUsers(!appendingUsers);
  }

  useEffect(() => {
    if (!data) return;
    setTeams(data);
  }, [data]);

  return (
    <div className={classes.root}>
      <Button onClick={toggleAppendUsers}>Append Users</Button>
      <Grid container className={classes.content} spacing={3}>
        <DndProvider
          initialState={{
            [USERS]: [],
            [TEAMMATES]: [],
          }}
        >
          <Grid item xs={appendingUsers ? 9 : 12} md={appendingUsers ? 10 : 12}>
            <Droppable droppableId={TEAMMATES} droppable draggable={false}>
              <TeamTable teamId={teams[step]?.id} />
            </Droppable>
          </Grid>

          {appendingUsers && (
            <Grid item xs={3} md={2}>
              <UsersBank />
            </Grid>
          )}
        </DndProvider>
      </Grid>
      <div className={classes.footer}>
        <TabNavigation activeStep={step} setActiveStep={setStep} data={teams} />
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
  list: {},
  footer: { flexShrink: 0 },
}));
