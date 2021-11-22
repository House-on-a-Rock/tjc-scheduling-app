import { useTheme, makeStyles } from '@material-ui/core/styles';
import { Divider, Grid, Paper, Typography, useMediaQuery } from '@material-ui/core';

import { DashboardCard } from './DashboardCard';
import clsx from 'clsx';
import { useUsers } from 'features/users';
import { RecentSwaps } from './RecentSwaps';

// *Dashboard* (Top Bar)
// Notification- permit swap
// Go to "Notifications"
// number of swaps last month
// number of swaps this month

// *Cards*
// 1. Users
// Title- Users
// Content- [Number of Users, ]
// Action- to users page

// 2. Teams
// Title- Users
// Content- [Number of teams]
// Action- to teams page, to team permissions

export const Dashboard = () => {
  const classes = useStyles();
  const theme = useTheme();
  const md = useMediaQuery(theme.breakpoints.up('md'));

  const users = useUsers(2)?.data?.filter(({ firstName }) => !!firstName);

  return (
    <div>
      <Typography variant="h3">User Management</Typography>
      <Divider />
      <Paper elevation={0} className={classes.dashboard}>
        <Grid container direction={md ? 'row' : 'column'}>
          <Grid item container direction="column" md={8} lg={9}>
            <Grid item className={clsx(classes.grid)}>
              <DashboardCard />
            </Grid>
            <Divider />
            <Grid item className={clsx(classes.grid, classes.cards)}>
              <div className={classes.card}>
                <DashboardCard title="Users" />
              </div>
              <div className={classes.card}>
                <DashboardCard title="Teams" />
              </div>
            </Grid>
          </Grid>

          <Divider
            className={clsx(md && classes.divider)}
            orientation={md ? 'vertical' : 'horizontal'}
            flexItem={md}
          />

          <Grid item md={4} lg={3} className={classes.grid}>
            <Typography variant="h6">Recent Swaps</Typography>
            <Divider />

            <RecentSwaps />
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
    minHeight: 300,
  },
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
  card: {
    maxWidth: 300,
    minWidth: 200,
  },
  divider: { marginRight: -theme.spacing(0.125) },
}));
