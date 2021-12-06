import { ListItem as MuiListItem } from '@material-ui/core';
import { Draggable } from 'components/dnd';

export const ListItem = ({ draggable = false, children, ...props }) => {
  return draggable ? (
    <Draggable {...props}>
      <MuiListItem>{children}</MuiListItem>
    </Draggable>
  ) : (
    <MuiListItem>{children}</MuiListItem>
  );
};
