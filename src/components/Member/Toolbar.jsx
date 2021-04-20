import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import DeleteIcon from '@material-ui/icons/Delete';

const Toolbar = ({ handleAddOpen, handleDeleteOpen }) => {
  const classes = useStyles();
  return (
    <div className={classes.iconBar}>
      <IconButton component="span" onClick={handleAddOpen}>
        <PersonAddIcon />
      </IconButton>
      <IconButton component="span" onClick={handleDeleteOpen}>
        <DeleteIcon />
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
};

export default Toolbar;
