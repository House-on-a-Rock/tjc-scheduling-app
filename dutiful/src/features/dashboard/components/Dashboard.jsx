import { useTheme, makeStyles } from '@material-ui/core/styles';
import { Divider, Grid, Paper, Typography, useMediaQuery } from '@material-ui/core';

import { DashboardCard } from './DashboardCard';
import clsx from 'clsx';
import { useEffect } from 'react';

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
  const theme = useTheme();
  const md = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <div>
      <Typography variant="h3">User Management</Typography>
      <Divider />
      <Paper elevation={0} className={classes.dashboard}>
        <Grid container direction={md ? 'row' : 'column'}>
          <Grid item container direction="column" md={10}>
            <Grid item className={clsx(classes.grid)}>
              <DashboardCard />
            </Grid>
            <Divider />
            <Grid item className={clsx(classes.grid, classes.cards)}>
              <DashboardCard title="Users" />
              <DashboardCard title="Teams" />
            </Grid>
          </Grid>

          <Divider
            orientation={md ? 'vertical' : 'horizontal'}
            flexItem={md}
            className={clsx(md && classes.divider)}
          />

          <Grid item md={2} className={classes.grid}>
            <Typography variant="h6">Recent Duty Switch</Typography>
            {<Divider />}
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
  divider: { marginRight: -theme.spacing(0.125) },
}));
