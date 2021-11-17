import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import { EventNote, Assignment, Group } from '@material-ui/icons';

import { Header, ToolbarPlaceholder } from 'components/header';
import { NavSidebar } from 'components/sidebar';

const navigationOptions = [
  {
    label: 'Scheduling Tool',
    url: '/schedule',
    icon: <EventNote />,
  },
  {
    label: 'Teams',
    url: '/teams',
    icon: <Group />,
    children: [
      {
        label: 'Users',
        url: '/users',
        icon: <Group />,
      },
    ],
  },
  {
    label: 'Templates',
    url: '/templates',
    icon: <Assignment />,
  },
];

export const MainLayout = ({ children }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleDrawer = () => {
    setOpen(!open);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Header handleDrawer={handleDrawer} />
      <NavSidebar open={open} options={navigationOptions} />
      <main className={classes.content}>
        <ToolbarPlaceholder />
        {children}
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
