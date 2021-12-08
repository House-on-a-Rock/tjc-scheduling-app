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

  const setClass = (snapshot) => {
    if (!snapshot.isDraggingOver) return '';
    return reorderable ? classes.reorderable : classes.droppable;
  };

  const BaseChildren = (provided, snapshot) =>
    cloneElement(children, {
      ref: provided.innerRef,
      className: clsx(className, classes.base, setClass(snapshot)),
    });

  const DraggableChildren = (provided, snapshot) => (
    <>
      <MuiList
        ref={provided.innerRef}
        {...props}
        className={clsx(
          className,
          classes.base,
          // setClass(snapshot) // TODO this styling is ugly
        )}
      >
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
  reorderable: {
    border: 'dotted 2px',
    borderColor: theme.palette.grey[600],
    height: 'fit-content',
  },
  droppable: {
    backgroundColor: theme.palette.grey[100],
    border: 'dotted 2px',
    borderColor: theme.palette.grey[600],
    '& *': { color: theme.palette.grey[500] },
  },
}));
