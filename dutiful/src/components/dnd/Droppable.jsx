import { List as MuiList } from '@material-ui/core';
import { cloneElement } from 'react';

import { Droppable as DndDroppable } from 'react-beautiful-dnd';

export const Droppable = ({ droppable = false, droppableId, draggable, children }) => {
  return (
    <DndDroppable
      renderClone={getRenderClone(children)}
      droppableId={droppableId ?? 'list'}
      isDropDisabled={!droppable}
    >
      {(provided, snapshot) =>
        draggable ? (
          <MuiList ref={provided.innerRef}>{children(provided, snapshot)}</MuiList>
        ) : (
          <div ref={provided.innerRef}>{children}</div>
        )
      }
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
