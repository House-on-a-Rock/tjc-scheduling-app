import { makeStyles } from '@material-ui/core/styles';
import { Container, CssBaseline, Typography } from '@material-ui/core';

import { Header, ToolbarPlaceholder } from 'components/header';
import { NavigationSidebar } from 'components/navigation';
import { DrawerProvider } from 'providers';

export const MainLayout = ({ headers, sidebar, children }) => {
  const classes = useStyles();

  const title = (
    <Typography variant="h5" noWrap style={{ fontWeight: 600 }}>
      DUTIFUL SOFTWARE
    </Typography>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <DrawerProvider>
        <Header title={title} actions={headers} />
        <NavigationSidebar options={sidebar} />
      </DrawerProvider>
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
