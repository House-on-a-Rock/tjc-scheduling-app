import { List as MuiList } from '@material-ui/core';
import { Droppable } from 'components/dnd';

export const List = ({ droppable = false, droppableId, children, ...props }) => {
  if (!droppableId) console.error('This component needs a droppableId');
  return droppable ? (
    <Droppable droppableId={droppableId}>
      <MuiList>{children}</MuiList>
    </Droppable>
  ) : (
    <MuiList>{children}</MuiList>
  );
};
