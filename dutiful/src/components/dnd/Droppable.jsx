import { Droppable as DndDroppable } from 'react-beautiful-dnd';
import { List as MuiList } from '@material-ui/core';
import { draggedChild } from '.';

export const Droppable = ({
  droppable = false,
  droppableId,
  draggable,
  children,
  reorderable,
}) => {
  const droppableProps = (() => {
    let props = {
      droppableId: droppableId ?? 'list',
      renderClone: draggedChild(children),
      isDropDisabled: !(droppable || reorderable),
    };
    return props;
  })();

  const draggableProps = (() => {
    let props = { draggable, reorderable };
    return props;
  })();

  const BaseChild = (provided, snapshot) => <div ref={provided.innerRef}>{children}</div>;

  const DraggableChild = (provided, snapshot) => (
    <>
      <MuiList ref={provided.innerRef}>
        {children({ provided, snapshot, ...draggableProps })}
      </MuiList>
      {reorderable && provided.placeholder}
    </>
  );

  return (
    <DndDroppable {...droppableProps}>
      {draggable ? DraggableChild : BaseChild}
    </DndDroppable>
  );
};
