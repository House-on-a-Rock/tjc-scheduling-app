import { Droppable as DndDroppable } from 'react-beautiful-dnd';
import { List as MuiList } from '@material-ui/core';
import { draggedChild } from '.';

export const Droppable = ({
  droppable = false,
  droppableId,
  draggable,
  children,
  reorderable,
  ...props
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
    let props = { draggable: reorderable || draggable, reorderable };
    return props;
  })();

  const BaseChild = (provided, snapshot) => (
    <div ref={provided.innerRef} {...props} style={{ height: 'inherit' }}>
      {children}
    </div>
  );

  const DraggableChild = (provided, snapshot) => (
    <>
      <MuiList ref={provided.innerRef} {...props}>
        {children({ provided, snapshot, ...draggableProps })}
      </MuiList>
      {reorderable && provided.placeholder}
    </>
  );

  return (
    <DndDroppable {...droppableProps}>
      {reorderable || draggable ? DraggableChild : BaseChild}
    </DndDroppable>
  );
};
