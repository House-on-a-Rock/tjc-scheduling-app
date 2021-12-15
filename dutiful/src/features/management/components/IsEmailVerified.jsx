import { makeStyles } from '@material-ui/core';
import { PillButton } from 'components/button';
import { TableCell } from 'components/table';

export const IsEmailVerified = ({ value }) => {
  const classes = useStyles();
  return (
    <TableCell>
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
    </TableCell>
  );
};

const useStyles = makeStyles((theme) => ({
  remind: {
    marginLeft: theme.spacing(1),
  },
}));
