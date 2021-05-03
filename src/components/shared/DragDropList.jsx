import React from 'react';
import PropTypes from 'prop-types';

import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { days } from '../Schedule/utilities';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import ReorderIcon from '@material-ui/icons/Reorder';

const DragDropList = ({ listItems, onEnd, serviceId }) => {
  const classes = useStyles();
  return (
    <DragDropContext onDragEnd={onEnd} key={'DragDropList'}>
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
                    {...dragProvided.dragHandleProps}
                  >
                    <div className={item.serviceId === serviceId ? classes.selected : ''}>
                      <ReorderIcon />
                      {days[item.day]} {item.name}
                    </div>
                  </li>
                )}
              </Draggable>
            ))}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
};

// howard mbbe u got this part
const useStyles = makeStyles(() =>
  createStyles({
    dragItem: {
      display: 'flex',
      flexDirection: 'row',
    },
    selected: {
      backgroundColor: '#82a5c4',
    },
  }),
);

DragDropList.propTypes = {
  listItems: PropTypes.array,
  onEnd: PropTypes.func,
  serviceId: PropTypes.number,
};

export default DragDropList;
