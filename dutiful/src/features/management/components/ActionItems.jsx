import { makeStyles } from '@material-ui/core';
import { DeleteOutline, EditOutlined } from '@material-ui/icons';
import { PillButton } from 'components/button';

export const ActionItems = (item) => {
  const classes = useStyles();
  return (
    <div>
      <PillButton
        color="primary"
        onClick={() => console.log(item)}
        className={classes.edit}
        label="Edit"
        variant="outlined"
        icon={<EditOutlined fontSize="small" />}
      />
      <PillButton
        color="secondary"
        onClick={() => console.log(item)}
        className={classes.edit}
        label="Delete"
        variant="outlined"
        icon={<DeleteOutline fontSize="small" />}
      />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  edit: { marginRight: theme.spacing(1) },
}));
