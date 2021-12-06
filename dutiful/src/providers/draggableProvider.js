import { DragDropContext as DndContext } from 'react-beautiful-dnd';

export const DraggleProvider = ({ drag = false, onDragEnd, children }) => {
  return !drag ? { children } : <DndContext onDragEnd={onDragEnd}>{children}</DndContext>;
};
