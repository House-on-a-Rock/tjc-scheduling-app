import { List as MuiList } from '@material-ui/core';
import { cloneElement } from 'react';

import { Droppable as DndDroppable } from 'react-beautiful-dnd';

export const Droppable = ({ droppable = false, droppableId, children }) => {
  return (
    <DndDroppable
      renderClone={getRenderClone(children)}
      droppableId={droppableId ?? 'list'}
      isDropDisabled={!droppable}
    >
      {(provided, snapshot) => (
        <MuiList ref={provided.innerRef}>{children(provided, snapshot)}</MuiList>
      )}
    </DndDroppable>
  );
};

const getRenderClone = (children) => {
  return (provided, snapshot, rubric) => {
    const Child = children(provided, snapshot)[rubric.source.index];
    return (
      <div
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={provided.innerRef}
        style={provided.draggableProps.style}
      >
        {cloneElement(Child, {
          ...provided.draggableProps,
          ...provided.dragHandleProps,
          style: provided.draggableProps.style,
        })}
      </div>
    );
  };
};
