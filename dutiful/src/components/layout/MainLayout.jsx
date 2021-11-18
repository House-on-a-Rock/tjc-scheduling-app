import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, CssBaseline, Typography } from '@material-ui/core';
import {
  EventNote,
  Assignment,
  AccountCircle,
  RecentActors,
  Home,
  Mail,
  Notifications,
} from '@material-ui/icons';

import { Header, ToolbarPlaceholder } from 'components/header';
import { NavSidebar } from 'components/sidebar';
import { useAuthorization } from 'lib/authorization';
import { useAuth } from 'lib/auth';
import { ADMIN, HYMN_LEADER } from 'constants/permission';

export const MainLayout = ({ children }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);

  const handleDrawer = () => {
    setOpen(!open);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <HeaderNavigation toggleDrawer={handleDrawer} />
      <AppSideNavigation open={open} />
      <main className={classes.content}>
        <ToolbarPlaceholder />
        <Container maxWidth="lg">{children}</Container>
      </main>
    </div>
  );
};

const HeaderNavigation = ({ toggleDrawer }) => {
  const { logout } = useAuth();
  const headerActions = [
    {
      key: 'mail',
      label: 'show 4 new mails',
      icon: <Mail />,
      disabled: true,
    },
    {
      key: 'notification',
      label: 'show new notifications',
      icon: <Notifications />,
      type: 'menu',
      list: [
        { text: 'Notification 1', type: 'link', url: '/notifications' },
        { text: 'Notification 2', type: 'link', url: '/notifications' },
        { text: 'Notification 3', type: 'link', url: '/notifications' },
        { text: 'Notification 4', type: 'link', url: '/notifications' },
      ],
      disabled: true,
      tooltip: 'Notifications',
    },
    {
      key: 'account',
      label: 'account settings',
      icon: <AccountCircle />,
      type: 'menu',
      list: [
        { text: 'Profile', type: 'link', url: '/profile' },
        { text: 'My Account', type: 'link', url: '/settings' },
        { text: 'Logout', onClick: () => logout() },
      ],
      tooltip: 'Account',
    },
  ];

  return (
    <Header handleDrawer={toggleDrawer} actions={headerActions}>
      <Typography variant="h5" noWrap style={{ fontWeight: 600 }}>
        DUTIFUL SOFTWARE
      </Typography>
    </Header>
  );
};

const AppSideNavigation = ({ open }) => {
  const { checkAccess } = useAuthorization();
  const navigationOptions = [
    { title: 'Unhidden', icon: <Home />, type: 'title' },
    {
      title: 'Scheduling Tool',
      url: '/schedule',
      icon: <EventNote />,
      label: 'schedule',
    },
    {
      title: 'User Management',
      label: 'manage',
      url: '/manage',
      icon: <RecentActors />,
      children: [
        checkAccess({ allowedRoles: [ADMIN] }) && {
          title: 'Users',
          label: 'users',
          url: '/users',
        },
        checkAccess({ allowedRoles: [HYMN_LEADER] }) && {
          title: 'Teams',
          label: 'teams',
          url: '/teams',
        },
        { title: 'Permissions', label: 'permission', url: '/permission', disabled: true },
      ].filter(Boolean),
    },
    { title: 'Templates', label: 'templates', url: '/templates', icon: <Assignment /> },
  ];

  return <NavSidebar open={open} options={navigationOptions} />;
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },

  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));
