import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, ListItemText, Paper, Typography } from '@material-ui/core';
import { List, ListItem } from 'components/list';
import { useDnd } from 'lib/dnd';
import { USERS, useUsers } from '..';
import { Textfield } from 'components/textfield';

const makeFullName = (user) => `${user.firstName} ${user.lastName}`;

export const UsersBank = ({ filterKey }) => {
  const classes = useStyles();
  const { data: usersData } = useUsers(2);
  const { state, bootstrapState } = useDnd();
  const [search, setSearch] = useState('');

  function handleSearch(event) {
    setSearch(event.target.value);
  }

  function isInactive(user) {
    return !!user.firstName && user.isVerified && !user.disabled;
  }

  function applySearchFilter(user) {
    const firstname = user.firstName.toLowerCase();
    const lastname = user.lastName.toLowerCase();
    return firstname.includes(search) || lastname.includes(search);
  }

  function applyParentFilter(user) {
    const filter = state[filterKey].map(makeFullName);
    return !filter.includes(makeFullName(user));
  }

  const filteredUsers = (() => {
    if (!state[USERS]) return false;
    const filteredState = state[USERS].filter(applyParentFilter);
    if (!search) return filteredState;
    return filteredState.filter(applySearchFilter);
  })();

  useEffect(() => {
    if (!usersData) return;
    const activeUsers = usersData
      .filter(isInactive)
      .filter(applyParentFilter)
      .map((user) => ({ ...user, id: user.userId }));
    bootstrapState({ [USERS]: activeUsers });
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
          value={search}
          onChange={handleSearch}
          variant="outlined"
          size="small"
        />

        <List droppableId={USERS} draggable className={classes.list} reorderable>
          {filteredUsers.map((item, index) => (
            <ListItem
              className={classes.card}
              component={Card}
              elevation={0}
              key={item.id}
              index={index}
              item={item}
            >
              <ListItemText primary={makeFullName(item)} />
            </ListItem>
          ))}
        </List>
      </Paper>
    )
  );
};

const useStyles = makeStyles((theme) => ({
  card: {
    margin: `${theme.spacing(2)}px 0`,
    border: 'solid 1px',
    borderColor: theme.palette.grey[300],
  },
  root: { padding: theme.spacing(3), height: 'inherit' },
  text: { marginTop: theme.spacing(1), marginLeft: theme.spacing(1) },
  spacing: { marginBottom: theme.spacing(2) },
  list: { overflow: 'scroll', height: '88.5%' },
}));
