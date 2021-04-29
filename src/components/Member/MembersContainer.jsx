import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles } from '@material-ui/core';
import { loadingTheme } from '../../shared/styles/theme';

import { MembersHeader, MembersTable, NewMemberFormDialog, Toolbar } from '.';
import { ConfirmationDialog } from '../shared';

import useMembersContainerData from '../../hooks/containerHooks/useMembersContainerData';
import { updateSelectedRows } from './utilities';

// TODO fix this thingy

const MembersContainer = ({ churchId }) => {
  const classes = useStyles();
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchField, setSearchField] = useState('');
  const [lastSelected, setLastSelected] = useState(-1);
  const [selectedRows, setSelectedRows] = useState([]);
  // const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isNewMemberDialogOpen, setIsNewMemberDialogOpen] = useState(false);
  const [warning, setWarning] = useState('');

  const [isUsersLoading, users, createUser, deleteUser] = useMembersContainerData(
    churchId,
    setContainerState,
  );

  function setContainerState({ event, result, payload }) {
    switch (event) {
      case 'NEW_USER':
        if (result === 'SUCCESS') setIsNewMemberDialogOpen(false);
        else if (result === 'ERROR'); // do something with payload
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    console.log('users', users);
    if (users) setFilteredMembers(users.filter((user) => !!user.firstName));
  }, [users]);

  const checkSelectedRows = (id) => selectedRows.includes(id);
  const USER = 'user';

  const handleDeleteMembers = () => {
    // try {
    //   selectedRows.map((member) => mutateRemoveUser.mutate(member));
    //   // selectedRows.map(async (member) => mutateRemoveUser(member)); // removed await, unsure if this is right
    // } catch (err) {
    //   console.log('uh oh cant delete this guy too stonks');
    // }
    // setSelectedRows([]);
  };

  const onCloseAddMemberDialog = (firstName, lastName, email) => {
    // if (
    //   shouldAdd &&
    //   firstName &&
    //   lastName &&
    //   email &&
    //   password &&
    //   isValidEmail(email) &&
    //   churchId
    // ) {
    //   const mutateAddUserVars: AddUserProps = {
    //     email,
    //     firstName,
    //     lastName,
    //     password,
    //     churchId,
    //   };
    //   mutateAddUser.mutate(mutateAddUserVars);
    // }
    // setIsAddMemberDialogOpen(false);
  };

  const onSelectAll = (checked) =>
    checked ? setSelectedRows(users.map(({ userId }) => userId)) : setSelectedRows([]);

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

  const warningDialogConfig = {
    [USER]: {
      title: 'Are you sure you want to delete this user?',
      accepted: () => {
        // needs qs to do array deletes
        selectedRows.map((id) => deleteUser(id));
      },
    },
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
          <Toolbar
            handleAddOpen={() => setIsNewMemberDialogOpen(!isNewMemberDialogOpen)}
            handleDeleteOpen={() => !!selectedRows.length && setWarning(USER)}
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
        state={!!warning}
        handleClick={(accepted) => {
          if (accepted) warningDialogConfig[warning].accepted();
          else setWarning('');
        }}
        title={warningDialogConfig[warning]?.title}
      />
      <NewMemberFormDialog
        state={isNewMemberDialogOpen}
        handleSubmit={() => createUser.mutate()}
        handleClose={() => setIsNewMemberDialogOpen(false)}
        title="Add User"
      />
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

function errorHandling(result, setError) {
  setError({
    status: result.response.status,
    message: result.response.statusText,
  });
}

MembersContainer.propTypes = {
  churchId: PropTypes.number,
};

export default MembersContainer;
