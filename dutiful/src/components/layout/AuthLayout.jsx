import { Container, CssBaseline } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

export const AuthLayout = ({ children }) => {
  const classes = useStyles();
  return (
    <Container className={classes.root} component="main" maxWidth="xs">
      <CssBaseline />
      {children}
    </Container>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    minHeight: '100vh',
  },
}));
