import { Draggable as DndDraggable } from 'react-beautiful-dnd';
import { ListItem as MuiListItem } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

export const Draggable = ({ item, index, children, snapshot }) => {
  const classes = useStyles();
  const shouldRenderClone = snapshot.draggingFromThisWith === String(item.id);

  return shouldRenderClone ? (
    <MuiListItem className={classes.placeholder}>{children}</MuiListItem>
  ) : (
    <DndDraggable key={item.id} draggableId={String(item.id)} index={index}>
      {(draggableProvided, draggableSnapshot) => {
        return (
          <MuiListItem
            className={draggableSnapshot.isDragging ? classes.dragging : ''}
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
};

const useStyles = makeStyles((theme) => ({
  placeholder: {
    transform: 'none !important',
    '&~ [data-rbd-draggable-context-id]': {
      transform: 'none !important',
    },
  },
  dragging: { backgroundColor: 'orange' },
}));
