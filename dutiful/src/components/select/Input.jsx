import { InputBase } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

export const Input = withStyles((theme) => ({
  input: {
    borderRadius: theme.shape.borderRadius,
    width: theme.spacing(10),
    backgroundColor: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.grey[400],
    fontSize: theme.typography.htmlFontSize,
    paddingLeft: theme.spacing(1),
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    maxHeight: theme.spacing(2),
    '&:focus': {
      borderRadius: theme.shape.borderRadius,
      borderColor: theme.palette.primary.main,
      backgroundColor: theme.palette.background.paper,
    },
  },
}))(InputBase);
