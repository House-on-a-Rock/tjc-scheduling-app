import React from 'react';
import { IconButton } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import DeleteIcon from '@material-ui/icons/Delete';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';

export const Toolbar = ({ handleAddOpen, handleDeleteOpen, handleRequestOpen }: any) => {
  const classes = useStyles();
  return (
    <div className={classes.iconBar}>
      <IconButton component="span" onClick={handleAddOpen}>
        <PersonAddIcon />
      </IconButton>
      <IconButton component="span" onClick={handleDeleteOpen}>
        <DeleteIcon />
      </IconButton>
      <IconButton component="span" onClick={handleRequestOpen}>
        <EventAvailableIcon />
      </IconButton>
    </div>
  );
};
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    iconBar: {
      display: 'flex',
    },
  }),
);
