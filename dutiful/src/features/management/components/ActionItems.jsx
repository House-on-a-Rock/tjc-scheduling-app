import { makeStyles } from '@material-ui/core';
import { DeleteOutline, EditOutlined } from '@material-ui/icons';
import { TableCellButton } from 'components/button';

export const ActionItems = (item) => {
  const classes = useStyles();
  return (
    <div>
      <TableCellButton
        color="primary"
        onClick={() => console.log(item)}
        className={classes.edit}
        startIcon={<EditOutlined fontSize="small" />}
      >
        Edit
      </TableCellButton>
      <TableCellButton
        color="secondary"
        onClick={() => console.log(item)}
        startIcon={<DeleteOutline fontSize="small" />}
      >
        Delete
      </TableCellButton>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  edit: { marginRight: theme.spacing(1) },
}));
