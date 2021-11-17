import { makeStyles } from '@material-ui/core';

export const ToolbarPlaceholder = () => {
  const classes = useStyles();
  return <div className={classes.toolbar} />;
};

const useStyles = makeStyles((theme) => ({
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
}));
