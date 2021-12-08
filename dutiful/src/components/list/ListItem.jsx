import { ListItem as MuiListItem } from '@material-ui/core';
import { Draggable } from 'components/dnd';

export const ListItem = ({ draggable = false, children, ...props }) => {
  const Base = <MuiListItem {...props}>{children}</MuiListItem>;
  const DraggableListItem = <Draggable {...props}>{children}</Draggable>;

  return draggable ? DraggableListItem : Base;
};
