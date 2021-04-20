import React from 'react';
import { v4 as uuid } from 'uuid';

import ListItem from '@material-ui/core/ListItem';

export const getRenderItem = (items, className) => (provided, snapshot) => {
  const item = items[rubric.source.index];
  return (
    <React.Fragment>
      <ListItem
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={provided.innerRef}
        style={provided.draggableProps.style}
        className={snapshot.isDragging ? 'dragging' : ''}
        key={item.id}
      >
        {item.name}
      </ListItem>
    </React.Fragment>
  );
};

export function add(members, teamsState, droppableSource, droppableDestination) {
  const stateClone = teamsState[droppableDestination.droppableId];
  const member = members[droppableSource.index];
  stateClone.push({ ...member, id: uuid() });
  return { ...teamsState, [droppableDestination.droppableId]: stateClone };
}

export function reorder(state, start, end) {
  const list = state[start.droppableId];
  const [removed] = list.splice(start.index, 1);
  list.splice(end.index, 0, removed);
  return { ...state, [start.droppableId]: list };
}
