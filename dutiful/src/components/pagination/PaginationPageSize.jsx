/* eslint-disable react-hooks/exhaustive-deps */

import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';
import { Input, Select } from 'components/select';
import { Option } from 'components/select/Option';

export const PaginationPageSize = ({ pageSize, setPageSize }) => {
  const classes = useStyles();
  const sizes = [15, 30, 45, 60];

  function handleSelect(e) {
    return setPageSize(Number(e.target.value));
  }
  return (
    <Box component="span" className={classes.root}>
      <Typography>Page Size: </Typography>
      <Select
        className={classes.select}
        value={pageSize}
        onSelect={handleSelect}
        variant="standard"
        input={<Input />}
      >
        {sizes.map((size) => (
          <Option native key={size} value={size}>
            Show {size}
          </Option>
        ))}
      </Select>
    </Box>
  );
};

const useStyles = makeStyles((theme) => ({
  root: { display: 'flex', alignItems: 'center' },
  select: { marginLeft: theme.spacing(1) },
}));
