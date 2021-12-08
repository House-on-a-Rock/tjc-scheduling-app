import { Draggable as DndDraggable } from 'react-beautiful-dnd';
import { ListItem as MuiListItem } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { cloneElement } from 'react';

export const Draggable = ({ item, index, children, snapshot, reorderable }) => {
  const classes = useStyles();
  const shouldRenderClone =
    !reorderable && snapshot.draggingFromThisWith === String(item.id);

  const FixedItem = (
    <MuiListItem className={clsx(!reorderable && classes.fixed)}>{children}</MuiListItem>
  );

  const DraggableItem = (
    <DndDraggable key={item.id} draggableId={String(item.id)} index={index}>
      {(draggableProvided, draggableSnapshot) => {
        return (
          <MuiListItem
            className={clsx(classes.item, !reorderable && classes.fixed)}
            ref={draggableProvided.innerRef}
            {...draggableProvided.draggableProps}
            {...draggableProvided.dragHandleProps}
          >
            {children}
          </MuiListItem>
        );
      }}
    </DndDraggable>
  );

  return shouldRenderClone ? FixedItem : DraggableItem;
};

export const draggedChild = (children) => (provided, snapshot, rubric) => {
  const classes = useStyles();
  // Rubric holds the index of the child to be dragged
  const Child = children({ provided, snapshot })[rubric.source.index];
  return (
    <div
      className={classes.dragged}
      ref={provided.innerRef}
      style={provided.draggableProps.style}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      {cloneElement(Child, {
        ...provided.draggableProps,
        ...provided.dragHandleProps,
        style: provided.draggableProps.style,
      })}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  fixed: { transform: 'none !important' },
  item: {},
  dragged: {
    backgroundColor: theme.palette.grey[200],
  },
}));
