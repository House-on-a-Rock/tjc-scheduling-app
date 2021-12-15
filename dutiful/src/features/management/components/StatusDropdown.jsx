import { makeStyles } from '@material-ui/core';
import { Pill } from 'components/chip';
import { TableCell } from 'components/table';

export const StatusDropdown = ({
  value,
  row: { index },
  column: { id },
  updateMyData,
  ...props
}) => {
  const classes = useStyles();

  return (
    <TableCell editable>
      <TableCell.Select
        id="status-dropdown"
        value={value}
        onChange={(e) => console.log({ e })}
      >
        <TableCell.Option component={Pill} label="Active" value="Active" />
        <TableCell.Option
          component={Pill}
          label="Inactive"
          value="Inactive"
          className={classes.secondary}
        />
      </TableCell.Select>
    </TableCell>
  );
};

const useStyles = makeStyles((theme) => ({
  pill: {},
  secondary: { backgroundColor: theme.palette.secondary.main },
}));
