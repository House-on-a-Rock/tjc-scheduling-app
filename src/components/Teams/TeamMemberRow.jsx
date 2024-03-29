import React from 'react';
import PropTypes from 'prop-types';

// Material UI Components
import { createStyles, makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';

import { transitionTheme, buttonTheme } from '../../shared/styles/theme';

const TeamMemberRow = ({
  member,
  role,
  index,
  providedRef,
  draggableProps,
  dragHandleProps,
  snapshot,
  onDelete,
}) => {
  const classes = useStyles();
  return (
    <div ref={providedRef} {...draggableProps} {...dragHandleProps}>
      <ListItem className={`${classes.root} ${snapshot?.isDragging ? 'dragging' : ''}`}>
        <ListItemText id={member.id} primary={member.name} />
        <ListItemSecondaryAction>
          <IconButton onClick={() => onDelete(member, role, index)}>
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    </div>
  );
};

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      transition: transitionTheme.fast,
      '&:hover, &:focus': {
        backgroundColor: buttonTheme.filled.hover.backgroundColor,
        boxShadow: buttonTheme.filled.boxShadow,
        borderRadius: '0.5rem',
        color: 'white',
      },
    },
  }),
);

TeamMemberRow.propTypes = {
  member: PropTypes.object,
  role: PropTypes.object,
  index: PropTypes.number,
  providedRef: PropTypes.object,
  draggableProps: PropTypes.object,
  dragHandleProps: PropTypes.object,
  snapshot: PropTypes.object,
  onDelete: PropTypes.func,
};

export default TeamMemberRow;
