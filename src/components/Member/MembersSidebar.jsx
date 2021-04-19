import React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import { sideBarTheme } from '../../shared/styles/theme.js';

export const MembersSidebar = ({
  firstName,
  lastName,
  email,
  church,
  roles,
}) => {
  const classes = useStyles();
  return (
    <Grid item xs={3}>
      <List
        component={Paper}
        className={classes.sidebar}
        subheader={
          <ListSubheader className={classes.listSubheader} component={Paper}>
            Info
          </ListSubheader>
        }
      >
        <ListItem key="firstname" button>
          <ListItemText primary={firstName} secondary="firstname" />
        </ListItem>
        <ListItem key="lastname" button>
          <ListItemText primary={lastName} secondary="lastname" />
        </ListItem>
        <ListItem key="email" button>
          <ListItemText primary={email} secondary="email" />
        </ListItem>
        <ListItem key="church" button>
          <ListItemText primary={church} secondary="church" />
        </ListItem>
      </List>
      <Divider />
      <List
        component={Paper}
        className={classes.sidebar}
        subheader={
          <ListSubheader className={classes.listSubheader} component={Paper}>
            Roles
          </ListSubheader>
        }
      >
        {roles.map((role) => {
          return (
            <ListItem key={role} button>
              <ListItemText primary={role} />
            </ListItem>
          );
        })}
      </List>
    </Grid>
  );
};

const useStyles = makeStyles((theme) =>
  createStyles({
    sidebar: {
      backgroundColor: sideBarTheme.backgroundColor,
      boxShadow: sideBarTheme.boxShadow,
    },
    listSubheader: {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.contrastText,
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }),
);
