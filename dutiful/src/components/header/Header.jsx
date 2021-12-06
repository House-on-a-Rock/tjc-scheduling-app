import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';

import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';
import { HeaderAction } from './HeaderActions';
import { NavigationDrawerContext } from 'providers/drawerProvider';

export const Header = ({ actions, title }) => {
  const classes = useStyles();
  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar className={classes.root}>
        <div className={classes.left}>
          <NavigationDrawerContext.Consumer>
            {({ setIsOpen }) => (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={setIsOpen}
                edge="start"
                className={classes.burger}
              >
                <MenuIcon />
              </IconButton>
            )}
          </NavigationDrawerContext.Consumer>
          {title}
        </div>
        <div className={classes.badges}>
          {actions.map((action) => (
            <HeaderAction key={action.label} action={action} />
          ))}
        </div>
      </Toolbar>
    </AppBar>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  burger: {
    width: theme.spacing(7) + 1,
    marginRight: theme.spacing(1),
  },
  left: {
    display: 'flex',
    alignItems: 'center',
  },
}));
