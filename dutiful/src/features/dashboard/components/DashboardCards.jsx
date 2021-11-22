import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
} from '@material-ui/core';
import { LinkButton } from 'components/button/LinkButton';

export const DashboardCards = ({ users, teams }) => {
  return (
    <>
      <DashCard title="Users" url="users">
        <Typography variant="h5" component="h2">
          {users.length} Total Users
        </Typography>
      </DashCard>
      <DashCard title="Teams" url="teams">
        <Typography variant="h5" component="h2">
          {teams.length} Teams
        </Typography>
      </DashCard>
    </>
  );
};

const DashCard = ({ title, children, url }) => {
  const classes = useStyles();
  return (
    <Card className={classes.root} elevation={0}>
      <CardHeader title={title} />
      <CardContent className={classes.children}>{children ?? ''}</CardContent>
      <CardActions className={classes.footer}>
        <LinkButton to={url} size="small">
          Click to go to {`${title}`}
        </LinkButton>
      </CardActions>
    </Card>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 250,
    minWidth: 250,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 300,
  },
  title: { fontSize: theme.typography.fontSize },
  pos: { marginBottom: theme.spacing(1.5) },
  children: { flexGrow: 1 },
  footer: { flexShrink: 0 },
}));
