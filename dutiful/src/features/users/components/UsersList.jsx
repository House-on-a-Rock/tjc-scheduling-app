import { ListItemText, Paper } from '@material-ui/core';

import { List, ListItem } from 'components/list';
import { useDnd } from 'lib/dnd';
import { useEffect } from 'react';
import { USERS, useUsers } from '..';

export const UsersList = ({ droppableId, draggable }) => {
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
    <Paper>
      <List droppable={draggable} droppableId={USERS}>
        {state[USERS]?.map((user, index) => {
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
