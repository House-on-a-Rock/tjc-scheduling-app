import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles } from '@material-ui/core';

import { ConfirmationDialog } from '../shared';
import { loadingTheme } from '../../shared/styles/theme';
import { MembersHeader, MembersTable, NewMemberFormDialog, MembersToolbar } from '.';
import { updateSelectedRows } from './utilities';
import useMembersContainerData from '../../hooks/containerHooks/useMembersContainerData';
import RequestAvailabilitiesDialog from './Dialogs/RequestAvailabilitiesDialog';

const CREATE = 'CREATE';
const DELETE = 'DELETE';
const REQUEST = 'REQUEST';
const ACCEPT = 'ACCEPT';
const CLOSE = 'CLOSE';

// TODO fix this thingy.
// lol ted fix this thingy

const MembersContainer = ({ churchId }) => {
  const classes = useStyles();
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchField, setSearchField] = useState('');
  const [lastSelected, setLastSelected] = useState(-1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [dialogState, setDialogState] = useState({ value: '', error: '' });

  const [isUsersLoading, users, createUser, deleteUser] = useMembersContainerData(
    churchId,
    setContainerState,
  );

  function setContainerState({ event, result, payload }) {
    switch (event) {
      case 'CREATE_USER':
        if (result === 'SUCCESS') dialogConfig[CREATE][CLOSE]();
        else if (result === 'ERROR'); // do something with payload
        break;
      case 'DELETE_USER':
        if (result === 'SUCCESS') dialogConfig[DELETE][CLOSE]();
        else if (result === 'ERROR'); // do something with payload
        break;
      default:
        break;
    }
  }

  function resetDialogState() {
    setDialogState({ value: '', error: '' });
  }

  const dialogConfig = {
    [DELETE]: {
      title: 'Delete User(s)',
      warningText:
        'Are you sure you want to delete this user? This action cannot be undone.',
      [ACCEPT]: () => {
        // needs qs to do array deletes
        selectedRows.map((id) => deleteUser(id));
      },
      [CLOSE]: () => resetDialogState(),
      open: () => setDialogState({ ...dialogState, value: DELETE }),
    },
    [CREATE]: {
      title: 'Add A New User',
      description:
        'To add a user, please fill out the form completely. Ensure that the email is a unique email. ',
      [ACCEPT]: () => {
        selectedRows.map((id) => deleteUser(id));
      },
      [CLOSE]: () => resetDialogState(),
      open: () => setDialogState({ ...dialogState, value: CREATE }),
    },
  };

  useEffect(() => {
    if (users) setFilteredMembers(users.filter((user) => !!user.firstName));
  }, [users]);

  const checkSelectedRows = (id) => selectedRows.includes(id);

  const onSelectAll = (checked) =>
    setSelectedRows(checked ? users.map(({ userId }) => userId) : []);

  const onSelect = (shiftKeyPressed, { userId: id }) => {
    const targetRows = shiftKeyPressed
      ? updateSelectedRows(lastSelected, id, users)
      : [id];
    if (selectedRows.includes(id))
      // clause to unselect
      setSelectedRows(selectedRows.filter((rowId) => !targetRows.includes(rowId)));
    // clause to select
    else setSelectedRows([...selectedRows, ...targetRows]);
    setLastSelected(id);
  };

  if (isUsersLoading || !users) return <div>loading</div>;

  return (
    <div className={isUsersLoading ? classes.loading : ''}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MembersHeader
            localChurch="Philadelphia"
            onSearchChange={(event) => setSearchField(event.target.value)}
          />
          <MembersToolbar
            deletable={selectedRows.length > 0}
            handleAdd={() => setDialogState({ ...dialogState, value: CREATE })}
            handleDelete={() => setDialogState({ ...dialogState, value: DELETE })}
            handleRequestAvail={() => console.log('request availabilities')}
          />
          <MembersTable
            members={filteredMembers}
            selectedRowLength={selectedRows.length}
            checkSelected={checkSelectedRows}
            handleSelectAll={onSelectAll}
            handleSelect={onSelect}
          />
        </Grid>
      </Grid>
      <ConfirmationDialog
        open={dialogState.value === DELETE}
        handleClick={(response) => {
          dialogConfig[dialogState.value][response]();
        }}
        title={dialogConfig[DELETE].title}
        warning
        warningText={dialogConfig[DELETE].warningText}
      />
      <NewMemberFormDialog
        open={dialogState.value === CREATE}
        handleClick={(response, payload) =>
          dialogConfig[dialogState.value][response](payload)
        }
        // handleSubmit={() => createUser.mutate()}
        // handleClose={() => setIsNewMemberDialogOpen(false)}
        title={dialogConfig[CREATE].title}
        description={dialogConfig[CREATE].description}
      />
      {/* <RequestAvailabilitiesDialog state={} handleSubmit={} title={} handleClose={} /> */}
    </div>
  );
};

const useStyles = makeStyles(() =>
  createStyles({
    loading: {
      ...loadingTheme,
    },
  }),
);

MembersContainer.propTypes = {
  churchId: PropTypes.number,
};

export default MembersContainer;
