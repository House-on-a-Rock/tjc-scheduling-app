import clsx from 'clsx';
import { Draggable as DndDraggable } from 'react-beautiful-dnd';
import { makeStyles } from '@material-ui/core/styles';
import { ListItem as MuiListItem } from '@material-ui/core';

export const Draggable = ({
  item,
  index,
  children,
  snapshot,
  reorderable,
  provided,
  className,
  ...props
}) => {
  const classes = useStyles();
  const shouldRenderClone =
    !reorderable && snapshot.draggingFromThisWith === String(item.id);

  // Clone left behind
  const FixedItem = (
    <MuiListItem className={clsx(!reorderable && classes.fixed)} {...props}>
      {children}
    </MuiListItem>
  );

  const DraggableItem = (
    <DndDraggable key={item.id} draggableId={String(item.id)} index={index}>
      {(draggableProvided, draggableSnapshot) => {
        return (
          <MuiListItem
            className={clsx(className, !reorderable && classes.fixed)}
            ref={draggableProvided.innerRef}
            {...draggableProvided.draggableProps}
            {...draggableProvided.dragHandleProps}
            {...props}
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
      {Child}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  fixed: { transform: 'none !important' },
  isDragging: { margin: `${theme.spacing(1)}px 0` },
}));
