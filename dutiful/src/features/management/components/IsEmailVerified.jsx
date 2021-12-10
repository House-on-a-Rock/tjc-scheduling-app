import { makeStyles } from '@material-ui/core';
import { PillButton } from 'components/button';

export const IsEmailVerified = ({ value }) => {
  const classes = useStyles();
  return (
    <span>
      {value}
      {value === 'No' && (
        <PillButton
          className={classes.remind}
          label="Remind?"
          onClick={() => console.log('reminding')}
        />
      )}
    </span>
  );
};

const useStyles = makeStyles((theme) => ({
  remind: {
    marginLeft: theme.spacing(1),
  },
}));
