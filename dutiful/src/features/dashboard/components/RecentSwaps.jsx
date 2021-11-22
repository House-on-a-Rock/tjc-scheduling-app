import { makeStyles } from '@material-ui/core/styles';
import { Divider, Grid, List, ListItem, Typography } from '@material-ui/core';

import { SwapHoriz } from '@material-ui/icons';
import { Fragment } from 'react';

export const RecentSwaps = () => {
  const classes = useStyles();
  return (
    <List>
      {exampleSwaps.map((swap) => {
        const { id, role, switcher, switchee, date } = swap;
        const targets = [switcher.firstName, <SwapHoriz />, switchee.firstName];
        return (
          <Fragment key={id}>
            <ListItem button>
              <Grid container>
                <Grid item xs={4}>
                  <Typography style={{ marginLeft: '-12px', fontWeight: 600 }}>
                    {role}
                  </Typography>
                </Grid>
                <Divider className={classes.divider} orientation="vertical" flexItem />
                <Grid item xs={8} className={classes.swappers}>
                  <Grid container style={{ width: '90%' }}>
                    {targets.map((item) => (
                      <Grid key={item} item xs={4} className={classes.target}>
                        <Typography>{item}</Typography>
                      </Grid>
                    ))}
                  </Grid>
                  <Typography>{convertDate(date)}</Typography>
                </Grid>
              </Grid>
            </ListItem>
            <Divider />
          </Fragment>
        );
      })}
    </List>
  );
};

const useStyles = makeStyles((theme) => ({
  swap: {
    display: 'flex',
    flexDirection: 'column',
  },
  target: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  divider: { marginLeft: '-1px' },
  swappers: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end' },
}));

const exampleSwaps = [
  {
    id: 1,
    date: new Date(),
    role: 'Hymn Leading',
    switcher: { firstName: 'Ted' },
    switchee: { firstName: 'Shaun' },
  },
  {
    id: 2,
    date: new Date(),
    role: 'Interpreting',
    switcher: { firstName: 'Shouli' },
    switchee: { firstName: 'Rebecca' },
  },
  {
    id: 3,
    date: new Date(),
    role: 'Piano',
    switcher: { firstName: 'Shenney' },
    switchee: { firstName: 'Chloe' },
  },
  {
    id: 4,
    date: new Date(),
    role: 'Usher',
    switcher: { firstName: 'Lopaka' },
    switchee: { firstName: 'Tatiana' },
  },
];

const convertDate = (date) =>
  date.toLocaleDateString(
    {},
    { timeZone: 'UTC', month: 'long', day: '2-digit', year: 'numeric' },
  );
