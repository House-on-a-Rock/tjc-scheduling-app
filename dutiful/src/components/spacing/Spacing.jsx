import { makeStyles } from '@material-ui/core/styles';

export const Spacing = ({ size }) => {
  const classes = useStyles({ size });
  return <div className={classes.root} />;
};

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: (props) => theme.spacing(props.size),
  },
}));
