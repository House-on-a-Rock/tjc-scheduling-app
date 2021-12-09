import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography, Paper } from '@material-ui/core';

import { UsersBank } from 'features/users/components';
import { TabNavigation } from 'components/navigation';
import { DndProvider } from 'lib/dnd';

import { TeamTable } from './TeamTable';
import { TEAMMATES, useTeams } from '../apis';
import { USERS } from 'features/users';
import { Spacing } from 'components/spacing';
import { useToggle } from 'hooks/useToggle';

export const TeamManagement = () => {
  const classes = useStyles();
  const [teams, setTeams] = useState([]);
  const [step, setStep] = useState(0);
  const { data } = useTeams(2);
  const [appendingUsers, setAppendingUsers] = useToggle(false);

  useEffect(() => {
    if (!data) return;
    setTeams(data);
  }, [data]);

  return (
    <Paper className={classes.root}>
      <DndProvider initialState={{ [USERS]: [], [TEAMMATES]: [] }} fixed={[TEAMMATES]}>
        <Grid container className={classes.content} spacing={3}>
          <Grid
            item
            xs={appendingUsers ? 8 : 12}
            md={appendingUsers ? 9 : 12}
            className={classes.gridItem}
          >
            <div className={classes.team}>
              <Typography variant="h4" className={classes.title}>
                Team Management
              </Typography>
              <Spacing size={4} />
              <TabNavigation activeStep={step} setActiveStep={setStep} data={teams} />
              <Spacing size={4} />

              <TeamTable teamId={teams[step]?.id} toggleAppendUsers={setAppendingUsers} />
            </div>
          </Grid>
          <Grid item xs={4} md={3} className={classes.gridItem}>
            {appendingUsers && <UsersBank filterKey={TEAMMATES} />}
          </Grid>
        </Grid>
      </DndProvider>
    </Paper>
  );
};

const useStyles = makeStyles((theme) => ({
  root: { padding: theme.spacing(4) },
  content: {
    flexGrow: 1,
    height: '80vh',
    marginBottom: theme.spacing(3),
  },
  title: { marginLeft: theme.spacing(1) },
  team: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: '0 2%',
  },
  gridItem: {},
  spacing: { marginBottom: theme.spacing(3) },
  footer: { flexShrink: 0 },
}));
