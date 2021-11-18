import { Container, makeStyles } from '@material-ui/core';
import { SentimentDissatisfiedOutlined } from '@material-ui/icons';

export const ErrorPage = ({
  statusCode = '404',
  message = 'Page not found',
  subtext = (
    <p>
      The page you are looking for doesn't exist or another error occurred. Go back or
      head over to <a href="/auth/login">link</a> to login
    </p>
  ),
}) => {
  const classes = useStyles();
  return (
    <Container className={classes.root} component="main" maxWidth="sm">
      <SentimentDissatisfiedOutlined className={classes.sad} />

      <div className={classes.statusCode}>{statusCode}</div>
      <div className={classes.message}>{message}</div>
      <div className={classes.subtext}>{subtext}</div>
    </Container>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    marginTop: -theme.spacing(10),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },
  sad: {
    fontSize: theme.spacing(25),
  },
  statusCode: {
    fontSize: theme.spacing(12),
  },
  message: {
    fontSize: theme.spacing(3),
  },
  subtext: {
    marginTop: theme.spacing(2),
    fontSize: theme.spacing(2),
  },
}));
