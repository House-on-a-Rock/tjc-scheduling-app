import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import DeleteIcon from '@material-ui/icons/Delete';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';

const Toolbar = ({ handleAddOpen, handleDeleteOpen, handleRequestOpen }) => {
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
const useStyles = makeStyles(() =>
  createStyles({
    iconBar: {
      display: 'flex',
    },
  }),
);

Toolbar.propTypes = {
  handleAddOpen: PropTypes.func,
  handleDeleteOpen: PropTypes.func,
  handleRequestOpen: PropTypes.func,
};

export default Toolbar;
