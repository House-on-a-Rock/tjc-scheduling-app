import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, ListItemText, Paper, Typography } from '@material-ui/core';
import { List, ListItem } from 'components/list';
import { useDnd } from 'lib/dnd';
import { USERS, useUsers } from '..';
import { Textfield } from 'components/textfield';

export const UsersBank = () => {
  const classes = useStyles();
  const { data: usersData } = useUsers(2);
  const { state, bootstrapState } = useDnd();
  const [filter, setFilter] = useState('');

  function handleFilter(event) {
    setFilter(event.target.value);
  }

  const filteredUsers = (() => {
    if (!state[USERS]) return false;
    if (!filter) return state[USERS];
    return state[USERS].filter((user) => {
      const firstname = user.firstName.toLowerCase();
      const lastname = user.lastName.toLowerCase();
      return firstname.includes(filter) || lastname.includes(filter);
    });
  })();

  useEffect(() => {
    if (!usersData) return;
    const filteredUsers = usersData
      .filter((user) => !!user.firstName && user.isVerified && !user.disabled)
      .map((user) => ({ ...user, id: user.userId }));
    bootstrapState({ [USERS]: filteredUsers });
  }, [usersData]);

  return (
    filteredUsers && (
      <Paper className={classes.root}>
        <Typography variant="h5" className={classes.text}>
          User Bank
        </Typography>
        <div className={classes.spacing} />
        <Textfield
          id="outlined-multiline-flexible"
          label="Filter"
          value={filter}
          onChange={handleFilter}
          variant="outlined"
          size="small"
        />

        <List droppableId={USERS} draggable className={classes.list}>
          {filteredUsers.map((item, index) => (
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
  root: { padding: theme.spacing(3), height: 'inherit' },
  text: { marginTop: theme.spacing(1), marginLeft: '8px' },
  spacing: { marginBottom: '16px' },
  list: { overflow: 'scroll', height: '88.5%' },
}));
