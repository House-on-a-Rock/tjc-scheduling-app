import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography } from '@material-ui/core';

import { UsersBank } from 'features/users/components';
import { TabNavigation } from 'components/navigation';
import { DndProvider } from 'lib/dnd';

import { TeamTable } from './TeamTable';
import { TEAMMATES, useTeams } from '../apis';
import { USERS } from 'features/users';

export const TeamManagement = () => {
  const classes = useStyles();

  const [teams, setTeams] = useState([]);
  const [step, setStep] = useState(0);
  const { data } = useTeams(2);
  const [appendingUsers, setAppendingUsers] = useState(false);

  function handleAppendingUsers() {
    setAppendingUsers(!appendingUsers);
  }

  useEffect(() => {
    if (!data) return;
    setTeams(data);
  }, [data]);

  return (
    <div className={classes.root}>
      <Typography variant="h4" className={classes.title}>
        Team Management
      </Typography>
      <div className={classes.spacing} />
      <TabNavigation activeStep={step} setActiveStep={setStep} data={teams} />
      <div className={classes.spacing} />
      <Grid container className={classes.grid} spacing={3}>
        <DndProvider initialState={{ [USERS]: [], [TEAMMATES]: [] }}>
          <Grid
            item
            xs={appendingUsers ? 8 : 12}
            md={appendingUsers ? 9 : 12}
            className={classes.gridItem}
          >
            <TeamTable
              teamId={teams[step]?.id}
              toggleAppendUsers={handleAppendingUsers}
            />
          </Grid>

          {appendingUsers && (
            <Grid item xs={4} md={3} className={classes.gridItem}>
              <UsersBank filterKey={TEAMMATES} />
            </Grid>
          )}
        </DndProvider>
      </Grid>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  title: { marginLeft: theme.spacing(1) },
  grid: {
    flexGrow: 1,
    height: '80vh',
    marginBottom: theme.spacing(3),
  },
  gridItem: { height: '72vh' },
  spacing: { marginBottom: theme.spacing(3) },
  footer: { flexShrink: 0 },
}));
