import { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, ListItemText, Paper } from '@material-ui/core';
import { List, ListItem } from 'components/list';
import { useDnd } from 'lib/dnd';
import { USERS, useUsers } from '..';

export const UsersBank = () => {
  const classes = useStyles();
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
            <ListItem
              className={classes.card}
              component={Card}
              elevation={0}
              key={item.id}
              index={index}
              item={item}
            >
              <ListItemText primary={`${item.firstName} ${item.lastName}`} />
            </ListItem>
          ))}
        </List>
      </Paper>
    )
  );
};

const useStyles = makeStyles((theme) => ({
  card: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    border: 'solid 1px',
    width: '95%',
  },
}));
