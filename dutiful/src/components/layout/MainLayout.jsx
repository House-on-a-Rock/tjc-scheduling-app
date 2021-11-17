import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, CssBaseline, Typography } from '@material-ui/core';
import {
  EventNote,
  Assignment,
  Group,
  RecentActors,
  GroupWork,
  Home,
  LockOpen,
} from '@material-ui/icons';

import { Header, ToolbarPlaceholder } from 'components/header';
import { NavSidebar } from 'components/sidebar';

const navigationOptions = [
  {
    title: 'Unhidden',
    icon: <Home />,
    type: 'title',
  },
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
      {
        title: 'Users',
        label: 'users',
        url: '/users',
        icon: <Group />,
      },
      {
        title: 'Teams',
        label: 'teams',
        url: '/teams',
        icon: <GroupWork />,
      },
      {
        title: 'Permissions',
        label: 'permission',
        url: '/manage',
        icon: <LockOpen />,
        disabled: true,
      },
    ],
  },
  {
    title: 'Templates',
    label: 'templates',
    url: '/templates',
    icon: <Assignment />,
  },
];

export const MainLayout = ({ children }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);

  const handleDrawer = () => {
    setOpen(!open);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Header handleDrawer={handleDrawer}>
        <Typography variant="h5" noWrap style={{ fontWeight: 600 }}>
          DUTIFUL SOFTWARE
        </Typography>
      </Header>
      <NavSidebar open={open} options={navigationOptions} />
      <main className={classes.content}>
        <ToolbarPlaceholder />
        <Container maxWidth="lg">{children}</Container>
      </main>
    </div>
  );
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
