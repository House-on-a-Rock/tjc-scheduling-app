import { ListItemText, Paper } from '@material-ui/core';

import { List, ListItem } from 'components/list';
import { useDnd } from 'lib/dnd';
import { useEffect } from 'react';
import { useUsers } from '..';

export const UsersList = ({ droppableId, draggable }) => {
  const { data: usersData } = useUsers(2);
  const { state, bootstrapState } = useDnd();

  useEffect(() => {
    if (!usersData) return;
    const filteredUsers = usersData
      .filter((user) => !!user.firstName && user.isVerified && !user.disabled)
      .map((user) => ({ ...user, id: user.userId }));
    bootstrapState({ users: filteredUsers });
  }, [usersData]);

  return (
    <Paper>
      <List droppable={draggable} droppableId="users-list">
        {state.users?.map((user, index) => {
          return (
            <ListItem draggable={draggable} key={index} item={user} index={index}>
              <ListItemText primary={user.firstName} />
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
};
