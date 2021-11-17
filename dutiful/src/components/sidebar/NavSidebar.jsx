import { useState } from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { ToolbarPlaceholder } from 'components/header';

const drawerWidth = 240;

export const NavSidebar = ({ open, options }) => {
  const classes = useStyles();
  const [selected, setSelected] = useState(0);

  function handleSelect(idx) {
    return () => {
      setSelected(idx);
    };
  }

  return (
    <Drawer
      variant="permanent"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        }),
      }}
    >
      <ToolbarPlaceholder />
      <List>{options.map(NavListItem(handleSelect, selected, classes.listIcon))}</List>
    </Drawer>
  );
};

const NavListItem = (handleSelect, selected, className) => (option, idx) => {
  return (
    <ListItem
      key={option.label}
      onClick={handleSelect(idx)}
      button
      component={Link}
      to={option.url}
      selected={selected === idx}
    >
      <ListItemIcon className={className}>{option.icon}</ListItemIcon>
      <ListItemText primary={option.label} />
    </ListItem>
  );
};

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  listIcon: {
    marginLeft: theme.spacing(1),
  },
}));
