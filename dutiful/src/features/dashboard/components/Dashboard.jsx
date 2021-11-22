import { useTheme, makeStyles } from '@material-ui/core/styles';
import { Divider, Grid, Paper, Typography, useMediaQuery } from '@material-ui/core';

import { DashboardCards } from './DashboardCards';
import clsx from 'clsx';
import { useUsers } from 'features/users';
import { RecentSwaps } from './RecentSwaps';
import { Button, Card, CardActions, CardContent } from '@material-ui/core';
import { useTeams } from 'features/teams/apis';

// *Dashboard* (Top Bar)
// Notification- permit swap
// Go to "Notifications"
// number of swaps last month
// number of swaps this month

export const Dashboard = () => {
  const classes = useStyles();
  const theme = useTheme();
  const md = useMediaQuery(theme.breakpoints.up('md'));

  const users = useUsers(2)?.data?.filter(({ firstName }) => !!firstName);
  const teams = useTeams(2)?.data;

  return (
    <div>
      <Typography variant="h3">User Management</Typography>
      <Divider />
      <Paper elevation={0} className={classes.dashboard}>
        <Grid container direction={md ? 'row' : 'column'}>
          <Grid
            item
            container
            md={8}
            lg={9}
            className={clsx(classes.grid, classes.cards)}
          >
            {users && teams && <DashboardCards users={users} teams={teams} />}
          </Grid>

          <Divider
            className={clsx(md && classes.divider)}
            orientation={md ? 'vertical' : 'horizontal'}
            flexItem={md}
          />
          <Grid item md={4} lg={3} className={classes.grid}>
            <Typography variant="h6" style={{ fontWeight: '700' }}>
              Recent Swaps
            </Typography>
            <Divider />
            <RecentSwaps />
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  dashboard: {
    marginTop: theme.spacing(6),
    padding: theme.spacing(3),
    backgroundColor: theme.palette.grey[200],
  },
  grid: {
    padding: theme.spacing(2),
  },
  cards: {
    display: 'flex',
    justifyContent: 'space-evenly',
  },

  divider: { marginRight: -theme.spacing(0.125) },
}));
