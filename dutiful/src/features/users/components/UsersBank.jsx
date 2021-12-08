import { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, ListItemText, Paper, Typography } from '@material-ui/core';
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
      <Paper className={classes.root}>
        <Typography variant="h5" align="center" className={classes.text}>
          User Bank
        </Typography>
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
    margin: `${theme.spacing(1)}px 0`,
    border: 'solid 1px',
    borderColor: theme.palette.grey[300],
  },
  root: { padding: theme.spacing(1) },
  text: { marginTop: theme.spacing(1) },
}));
