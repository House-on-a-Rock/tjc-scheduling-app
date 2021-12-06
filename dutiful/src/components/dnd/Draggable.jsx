import { Draggable as DndDraggable } from 'react-beautiful-dnd';

export const Draggable = ({ item, index, children }) => {
  return (
    <DndDraggable key={item.id} draggableId={String(item.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {children}
        </div>
      )}
    </DndDraggable>
  );
};
