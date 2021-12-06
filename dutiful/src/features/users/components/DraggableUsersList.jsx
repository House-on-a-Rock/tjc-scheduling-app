import { ListItemText, Paper } from '@material-ui/core';

import { List, ListItem } from 'components/list';

export const DraggableUsersList = ({ users, droppableId }) => {
  return (
    <Paper>
      <List droppable droppableId={droppableId}>
        {users?.map((user, index) => {
          return (
            <ListItem draggable key={index} item={user} index={index}>
              <ListItemText primary={user.firstName} />
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
};
