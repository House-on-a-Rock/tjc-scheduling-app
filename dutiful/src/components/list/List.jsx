import { List as MuiList } from '@material-ui/core';
import { Droppable } from 'components/dnd';

export const List = ({ component, children, ...props }) => {
  const droppable = props.droppable || props.draggable || props.reorderable;
  const Base = <MuiList>{children}</MuiList>;

  const DroppableList = <Droppable {...props}>{children}</Droppable>;

  return droppable ? DroppableList : Base;
};
