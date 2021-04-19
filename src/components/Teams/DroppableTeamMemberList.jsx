import React, { useState } from 'react';
import {
  Droppable,
  Draggable,
} from 'react-beautiful-dnd';
import { v4 as uuid } from 'uuid';

// Material UI Components
import { makeStyles, Theme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { TextField } from '@material-ui/core';

import { TeamMemberRow } from './TeamMemberRow';

export const DroppableTeamMembersList = ({
  role,
  members,
  canDrop,
  draggedItem,
}) => {
  const classes = useStyles();

  const [memberInput, setMemberInput] = useState({ value: '', error: '' });

  // handleSubmit and handleDelete are placeholder functions
  function handleSubmit(event) {
    event.preventDefault();
    if (members.find((member) => member.name === memberInput.value)) {
      setMemberInput({ ...memberInput, error: 'User already exists' });
    } else {
      members.push({ id: uuid(), name: memberInput.value });
      setMemberInput({ ...memberInput, value: '', error: '' });
    }
  }

  function handleDelete(selectedMember, index) {
    if (members.find((member) => member.name === selectedMember.name)) {
      members.splice(index, 1);
      setMemberInput({ ...memberInput, value: '', error: '' });
    }
  }

  return (
    <Droppable droppableId={role} key={role} isDropDisabled={!canDrop()}>
      {(provided, snapshot) => (
        <List
          dense
          ref={provided.innerRef}
          className={`${classes.list} ${!canDrop() && classes.notDroppableArea} ${
            snapshot?.isDraggingOver && canDrop() && classes.droppableArea
          }`}
        >
          {members.map((member, index) => {
            return !(draggedItem.source === 'USERBANK') ? (
              <Draggable draggableId={member.id} index={index} key={member.id}>
                {(
                  dragProvided,
                  dragSnapshot,
                ) => (
                  <TeamMemberRow
                    member={member}
                    role={role}
                    index={index}
                    providedRef={dragProvided.innerRef}
                    draggableProps={dragProvided.draggableProps}
                    dragHandleProps={dragProvided.dragHandleProps}
                    onDelete={handleDelete}
                    snapshot={dragSnapshot}
                  />
                )}
              </Draggable>
            ) : (
              <>
                <TeamMemberRow
                  member={member}
                  role={role}
                  index={index}
                  onDelete={handleDelete}
                />
              </>
            );
          })}
          {provided.placeholder}
          <ListItem>
            <form onSubmit={handleSubmit}>
              <TextField
                size="small"
                value={memberInput.value}
                onChange={(event) =>
                  setMemberInput({ ...memberInput, value: event.target.value })
                }
                placeholder="New name"
                onBlur={(event) => event.target.value && handleSubmit(event)}
                error={!!memberInput.error}
                helperText={memberInput.error}
              />
            </form>
          </ListItem>
        </List>
      )}
    </Droppable>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    margin: '.5em',
    height: '20vh',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    width: '15vw',
  },
  list: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '79%',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, 20ch)',
  },
  droppableArea: {
    background: 'lightblue',
  },
  notDroppableArea: {
    '&:hover': {
      opacity: 0.25,
    },
  },
}));
