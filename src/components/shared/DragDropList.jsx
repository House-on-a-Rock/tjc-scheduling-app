import React from 'react';
import PropTypes from 'prop-types';

import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { days } from '../Schedule/utilities';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import ReorderIcon from '@material-ui/icons/Reorder';

const DragDropList = ({ listItems, onEnd }) => {
  const classes = useStyles();
  return (
    <DragDropContext onDragEnd={onDragEnd} key={'DragDropList'}>
      <Droppable droppableId={'DropList'} key={'DropList'} direction="vertical">
        {(droppableProvided) => (
          <ul ref={droppableProvided.innerRef} {...droppableProvided.droppableProps}>
            {listItems.map((item, index) => (
              <Draggable
                draggableId={`draggable_${index}`}
                index={index}
                key={`draggable_${index}`}
              >
                {(dragProvided, dragSnapshot) => (
                  <li
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    className={classes.dragItem}
                    style={{
                      ...dragProvided.draggableProps.style,
                      background: dragSnapshot.isDragging
                        ? 'rgba(245,245,245, 0.75)'
                        : 'none',
                    }}
                  >
                    <div {...dragProvided.dragHandleProps}>
                      <ReorderIcon />
                    </div>
                    {days[item.day]} {item.name}
                  </li>
                )}
              </Draggable>
            ))}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );

  function onDragEnd() {
    onEnd();
  }
};

// howard mbbe u got this part
const useStyles = makeStyles(() =>
  createStyles({
    dragItem: {
      display: 'flex',
      flexDirection: 'row',
    },
  }),
);

DragDropList.propTypes = {
  listItems: PropTypes.array,
  onEnd: PropTypes.func,
};

export default DragDropList;
