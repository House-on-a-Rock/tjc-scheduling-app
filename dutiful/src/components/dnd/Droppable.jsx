import { Droppable as DndDroppable } from 'react-beautiful-dnd';

export const Droppable = ({ droppableId, children }) => {
  return (
    <DndDroppable droppableId={droppableId ?? 'list'}>
      {(provided, snapshot) => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          {children}
        </div>
      )}
    </DndDroppable>
  );
};
