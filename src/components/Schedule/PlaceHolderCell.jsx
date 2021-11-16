import React from 'react';
import MuiCell from '@material-ui/core/TableCell';
import { makeStyles, createStyles } from '@material-ui/core/styles';

// TODO - potentially add tooltip style hover text to describe why the cells are blanked out

const PlaceHolderCell = () => {
  const classes = useStyles();
  return <MuiCell className={classes.placeHolder}></MuiCell>;
};

const useStyles = makeStyles(() =>
  createStyles({
    placeHolder: {
      backgroundColor: '#c4c4c4',
    },
  }),
);

export default PlaceHolderCell;
