import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';
import { Textfield } from 'components/textfield';

export const PaginationTextfield = ({ currentPage, handlePageChange }) => {
  const classes = useStyles();
  function onChange(e) {
    const page = e.target.value ? Number(e.target.value) - 1 : 0;
    return handlePageChange(page)();
  }
  return (
    <Box component="span" className={classes.root}>
      <Typography>Go to page:</Typography>
      <Textfield
        defaultValue={currentPage + 1}
        variant="outlined"
        size="small"
        className={classes.textfield}
        InputProps={{ className: classes.innerTextfield }}
        onChange={onChange}
        type="number"
      />
    </Box>
  );
};

const useStyles = makeStyles((theme) => ({
  root: { display: 'flex', flexDirection: 'row' },
  textfield: { width: theme.spacing(10), marginLeft: theme.spacing(1) },
  innerTextfield: { maxHeight: theme.spacing(3.5) },
}));
