import React from 'react';
import { v4 as uuid } from 'uuid';
import {
  DraggableLocation,
  DraggableStateSnapshot,
  DraggableProvided,
  DraggableRubric,
} from 'react-beautiful-dnd';

import { MembersData, TeamData, TeamState } from './models';
import ListItem from '@material-ui/core/ListItem';

export const getRenderItem = (items: MembersData[], className: string) => (
  provided: DraggableProvided,
  snapshot: DraggableStateSnapshot,
  rubric: DraggableRubric,
) => {
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

export function add(
  members: MembersData[],
  teamsState: TeamState,
  droppableSource: DraggableLocation,
  droppableDestination: DraggableLocation,
): TeamState {
  const stateClone: TeamData[] = teamsState[droppableDestination.droppableId].members;
  const member = members[droppableSource.index];
  console.log(member);
  stateClone.push({ ...member, id: uuid() });
  return {
    ...teamsState,
    [droppableDestination.droppableId]: {
      roleId: teamsState[droppableDestination.droppableId].roleId,
      members: stateClone,
    },
  };
}

export function reorder(
  state: TeamState,
  start: DraggableLocation,
  end: DraggableLocation,
): TeamState {
  const list = state.members[start.droppableId];
  const [removed] = list.splice(start.index, 1);
  list.splice(end.index, 0, removed);
  return { ...state, [start.droppableId]: list };
}
