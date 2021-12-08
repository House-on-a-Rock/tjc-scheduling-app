import { cloneElement } from 'react';
import { Droppable as DndDroppable } from 'react-beautiful-dnd';
import { List as MuiList } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { draggedChild } from '.';
import clsx from 'clsx';

export const Droppable = ({
  droppable = false,
  droppableId,
  draggable,
  children,
  reorderable,
  className,
  ...props
}) => {
  const classes = useStyles();
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

  const BaseChildren = (provided, snapshot) => {
    return cloneElement(children, {
      ref: provided.innerRef,
      className: clsx(
        className,
        classes.base,
        snapshot.isDraggingOver && classes.hovered,
      ),
    });
  };

  if (children.length > 0) console.log({ children });

  const DraggableChildren = (provided, snapshot) => (
    <>
      <MuiList ref={provided.innerRef} {...props}>
        {children.map((child) =>
          cloneElement(child, { provided, snapshot, ...draggableProps }),
        )}
      </MuiList>
      {reorderable && provided.placeholder}
    </>
  );

  return (
    <DndDroppable {...droppableProps}>
      {reorderable || draggable ? DraggableChildren : BaseChildren}
    </DndDroppable>
  );
};
const useStyles = makeStyles((theme) => ({
  base: { height: 'inherit' },
  hovered: {
    backgroundColor: theme.palette.grey[100],
    border: 'dotted 2px',
    borderColor: theme.palette.grey[600],
    '& *': { color: theme.palette.grey[500] },
  },
}));
