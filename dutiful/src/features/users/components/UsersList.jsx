import { useEffect } from 'react';
import { ListItemText, Paper } from '@material-ui/core';
import { List, ListItem } from 'components/list';
import { useDnd } from 'lib/dnd';
import { USERS, useUsers } from '..';

export const UsersList = () => {
  const { data: usersData } = useUsers(2);
  const { state, bootstrapState } = useDnd();

  useEffect(() => {
    if (!usersData) return;
    const filteredUsers = usersData
      .filter((user) => !!user.firstName && user.isVerified && !user.disabled)
      .map((user) => ({ ...user, id: user.userId }));
    bootstrapState({ [USERS]: filteredUsers });
  }, [usersData]);

  return (
    state[USERS] && (
      <Paper>
        <List droppableId={USERS} draggable>
          {state[USERS].map((item, index) => (
            <ListItem key={item.id} index={index} item={item}>
              <ListItemText primary={item.firstName} />
            </ListItem>
          ))}
        </List>
      </Paper>
    )
  );
};
