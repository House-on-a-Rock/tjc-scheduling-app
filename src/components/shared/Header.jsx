import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import useScrollTrigger from '@material-ui/core/useScrollTrigger';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import Button from '@material-ui/core/Button';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { buttonTheme } from '../../shared/styles/theme';

import AuthContext from '../../shared/services/AuthContext';

const Header = (props) => {
  const auth = useContext(AuthContext);
  const classes = useStyles();

  const logoutHandler = () => {
    localStorage.removeItem('access_token');
    auth.logout();
  };
  return (
    <>
      <ElevationScroll {...props}>
        <AppBar>
          <Toolbar className={classes.toolbarMargin}>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="open drawer"
            >
              <MenuIcon />
            </IconButton>
            <Button
              component={Link}
              to="/home"
              className={classes.titleContainer}
              disableRipple
            >
              <Typography className={classes.title} variant="h6" noWrap>
                TJC Scheduling Platform
              </Typography>
            </Button>

            <div className={classes.routerButtonGroup}>
              <Button onClick={logoutHandler} className={classes.routerButtons}>
                Log Out
              </Button>
              <Button component={Link} to="/templates" className={classes.routerButtons}>
                Templates
              </Button>
              <Button component={Link} to="/users" className={classes.routerButtons}>
                Users
              </Button>
              <Button component={Link} to="/teams" className={classes.routerButtons}>
                Teams
              </Button>
            </div>
            <div className={classes.sectionDesktop}>
              <IconButton aria-label="show 4 new mails" color="inherit">
                <Badge badgeContent={4} color="secondary">
                  <MailIcon />
                </Badge>
              </IconButton>
              <IconButton aria-label="show 17 new notifications" color="inherit">
                <Badge badgeContent={17} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                // onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </div>
            <div className={classes.sectionMobile}>
              <IconButton
                aria-label="show more"
                aria-haspopup="true"
                // onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <div className={classes.toolbarMargin} />
    </>
  );
};

function ElevationScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

const useStyles = makeStyles((theme) =>
  createStyles({
    logoutButton: {
      position: 'fixed',
      zIndex: 200,
      padding: '10px',
      borderRadius: '5px',
      border: 'none',
      '&:hover, &:focus': { ...buttonTheme.filled.hover },
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      display: 'inline',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
      color: 'white',
    },
    logo: { height: '2em' },
    routerButtonGroup: {
      marginLeft: 'auto',
    },
    routerButtons: {
      color: 'white',
    },
    sectionDesktop: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'flex',
      },
    },
    sectionMobile: {
      display: 'flex',
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
    toolbarMargin: {
      ...theme.mixins.toolbar,
    },
    titleContainer: {},
  }),
);

export default Header;
