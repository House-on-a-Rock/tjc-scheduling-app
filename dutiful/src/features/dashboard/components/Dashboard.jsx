import { makeStyles } from '@material-ui/core/styles';
import { Divider, Grid, Paper, Typography } from '@material-ui/core';
import { DashboardCard } from './DashboardCard';
import clsx from 'clsx';

// *Dashboard*
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

// *Recent Swaps*
// 1. Date
// 2. Duty
// 3. Switcher
// 4. Switchee

export const Dashboard = () => {
  const classes = useStyles();

  return (
    <div>
      <Typography variant="h3">User Management</Typography>
      <Divider />
      <Paper elevation={0} className={classes.dashboard}>
        <Grid container>
          <Grid item container direction="column" xs={10}>
            <Grid item className={clsx(classes.grid)}>
              <DashboardCard />
            </Grid>
            <Divider />
            <Grid item className={clsx(classes.grid, classes.cards)}>
              <DashboardCard />
              <DashboardCard />
            </Grid>
          </Grid>
          <Divider orientation="vertical" flexItem style={{ marginRight: '-1px' }} />
          <Grid item xs={2} className={classes.grid}>
            <Typography variant="h6">Recent Duty Switch</Typography>
            <Divider />
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
}));
