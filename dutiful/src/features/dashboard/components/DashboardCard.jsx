import { makeStyles } from '@material-ui/core/styles';

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
} from '@material-ui/core';

export const DashboardCard = ({ title = '' }) => {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardHeader title={title} />
      <CardContent>
        <Typography variant="h5" component="h2">
          Stuff
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          adjective
        </Typography>
        <Typography variant="body2" component="p">
          well meaning and kindly.
          <br />
          {'"a benevolent smile"'}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Click to go to {`${title}`}</Button>
      </CardActions>
    </Card>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
    // minHeight: 300,
  },
  title: {
    fontSize: theme.typography.fontSize,
  },
  pos: {
    marginBottom: theme.spacing(1.5),
  },
}));
