import { List as MuiList } from '@material-ui/core';
import { Droppable } from 'components/dnd';
import { cloneElement } from 'react';

export const List = ({ children, ...props }) => {
  const droppable = props.droppable || props.draggable;
  const Base = <MuiList>{children}</MuiList>;

  const DroppableList = (
    <Droppable {...props}>
      {(provided, snapshot) =>
        children.map((child) => cloneElement(child, { snapshot, draggable: true }))
      }
    </Droppable>
  );

  return droppable ? DroppableList : Base;
};
