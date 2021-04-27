import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import {
  MembersHeader,
  MembersTable,
  NewMemberFormDialog,
  Toolbar,
} from '../../components/Member';
import { ConfirmationDialog } from '../../components/shared';

import { updateSelectedRows } from './utilities';

const USER = 'user';

const MembersContainer = ({ state, addUser, removeUser }) => {
  const { isLoading, error, data, isSuccess } = state;
  // Component state
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchField, setSearchField] = useState('');
  const [lastSelected, setLastSelected] = useState(-1);
  const [selectedRows, setSelectedRows] = useState([]);

  // const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isNewMemberDialogOpen, setIsNewMemberDialogOpen] = useState(false);
  const [warningDialog, setWarningDialog] = useState('');

  const isSelected = (id) => selectedRows.includes(id);

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
    checked
      ? setSelectedRows(data.users.map(({ userId }) => userId))
      : setSelectedRows([]);

  const onSelect = (shiftKeyPressed, { userId: id }) => {
    const targetRows = shiftKeyPressed
      ? updateSelectedRows(lastSelected, id, data.users)
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
        selectedRows.map((id) => removeUser(id));
      },
    },
  };

  useEffect(() => {
    if (data?.users) setFilteredMembers(filterMembers(data.users, searchField));
  }, [data, searchField]);

  useEffect(() => {
    if (isSuccess === 'NewUser') setIsNewMemberDialogOpen(false);
    if (isSuccess === 'DeleteUser') {
      console.log('deleted');
    }
  }, [isSuccess]);

  return (
    <>
      {data?.users && !isLoading && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MembersHeader
              localChurch="Philadelphia"
              onSearchChange={(event) => setSearchField(event.target.value)}
            />
            <Toolbar
              handleAddOpen={() => setIsNewMemberDialogOpen(!isNewMemberDialogOpen)}
              handleDeleteOpen={() => !!selectedRows.length && setWarningDialog(USER)}
            />
            <MembersTable
              members={filteredMembers}
              selectedRowLength={selectedRows.length}
              isSelected={isSelected}
              handleSelectAll={onSelectAll}
              handleSelect={onSelect}
            />
          </Grid>
          <ConfirmationDialog
            state={!!warningDialog}
            handleClick={(accepted) => {
              if (accepted) warningDialogConfig[warningDialog].accepted();
              else setWarningDialog('');
            }}
            title={warningDialogConfig[warningDialog]?.title}
          />
          <NewMemberFormDialog
            state={isNewMemberDialogOpen}
            handleSubmit={addUser}
            handleClose={() => setIsNewMemberDialogOpen(false)}
            title="Add User"
          />
        </Grid>
      )}
    </>
  );
};

const filterMembers = (users, target) =>
  users.filter(({ email, firstName, lastName }) => {
    const filterChar = target.toLowerCase();
    return (
      firstName.toLowerCase().includes(filterChar) ||
      lastName.toLowerCase().includes(filterChar) ||
      email.toLowerCase().includes(filterChar)
    );
  });

MembersContainer.propTypes = {
  state: PropTypes.object,
  addUser: PropTypes.func,
  removeUser: PropTypes.func,
};

export default MembersContainer;
