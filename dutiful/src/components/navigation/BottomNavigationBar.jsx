import { makeStyles } from '@material-ui/styles';
import { AppBar, Tab, Tabs } from '@material-ui/core';
import clsx from 'clsx';

export const BottomNavigation = ({ activeStep, setActiveStep, data }) => {
  const classes = useStyles();
  return (
    <AppBar color="default" position="static" className={classes.toolbar} elevation={0}>
      <Tabs
        value={activeStep}
        indicatorColor="primary"
        textColor="white"
        variant="scrollable"
        scrollButtons="auto"
      >
        {data.map((item, idx) => (
          <Tab
            className={clsx(classes.button, activeStep === idx && classes.selected)}
            label={item.name}
            onClick={() => setActiveStep(idx)}
          />
        ))}
      </Tabs>
    </AppBar>
  );
};

const useStyles = makeStyles((theme) => ({
  button: {},
  selected: {},
  toolbar: {
    borderRadius: 4,
    borderColor: theme.palette.primary.main,
  },
}));
