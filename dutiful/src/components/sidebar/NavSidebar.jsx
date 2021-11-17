import clsx from 'clsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer } from '@material-ui/core';
import { ToolbarPlaceholder } from 'components/header';
import { NavList } from './NavList';
import { useEffect, useState } from 'react';

const drawerWidth = 280;

export const NavSidebar = ({ open, options }) => {
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const [path, setPath] = useState('');

  function handleRoute(route) {
    setPath(route);
    navigate(route);
  }

  useEffect(() => {
    if (location.pathname !== '/') setPath(location.pathname);
  }, [location]);

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

      {path && (
        <NavList options={options} handleRoute={handleRoute} path={path} open={open} />
      )}
    </Drawer>
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
    background: theme.palette.grey[200],
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
    background: theme.palette.grey[200],
  },
}));
