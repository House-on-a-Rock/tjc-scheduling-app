import React, { useEffect, useState, ChangeEvent } from 'react';

import { Container, Grid } from '@material-ui/core';

import { ConfirmationDialog } from '../../components/shared';
import {
  MembersHeader,
  MembersTable,
  NewMemberFormDialog,
  Toolbar,
  RequestAvailabilitiesDialog,
} from '../../components/Member';
import { UsersDataInterface } from '../Schedules/ScheduleContainer';

import { updateSelectedRows } from './utilities';
import { DataStateProp } from '../types';
import { NewUserData } from '../../shared/types';
import { useValidatedField } from '../../hooks';

interface BootstrapMembersContainer {
  users: UsersDataInterface[];
}

interface MembersContainerProps {
  state: DataStateProp<BootstrapMembersContainer>;
  addUser: (newInfo: NewUserData) => void;
  removeUser: (newInfo: any) => void;
}

const DELETE = 'DELETE';
const REQUEST = 'REQUEST';

export const MembersContainer = ({
  state,
  addUser,
  removeUser,
}: MembersContainerProps) => {
  const { isLoading, error, data, isSuccess } = state;
  // Component state
  const [filteredMembers, setFilteredMembers] = useState<UsersDataInterface[]>([]);
  const [searchField, setSearchField] = useState<string>('');
  const [lastSelected, setLastSelected] = useState<number>(-1);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [dateRange, setDateRange] = useState([null, null]);

  const [isNewMemberDialogOpen, setIsNewMemberDialogOpen] = useState<boolean>(false);
  const [dialog, setDialog] = useState<string>('');

  const isSelected: (arg: number) => boolean = (id: number) => selectedRows.includes(id);

  const handleDeleteMembers = () => {
    // try {
    //   selectedRows.map((member) => mutateRemoveUser.mutate(member));
    //   // selectedRows.map(async (member) => mutateRemoveUser(member)); // removed await, unsure if this is right
    // } catch (err) {
    //   console.log('uh oh cant delete this guy too stonks');
    // }
    // setSelectedRows([]);
  };

  const onCloseAddMemberDialog = (firstName: string, lastName: string, email: string) => {
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

  const onSelectAll = (checked: boolean) =>
    checked
      ? setSelectedRows(data.users.map(({ userId }: UsersDataInterface) => userId))
      : setSelectedRows([]);

  const onSelect = (shiftKeyPressed: boolean, { userId: id }: UsersDataInterface) => {
    const targetRows: number[] = shiftKeyPressed
      ? updateSelectedRows(lastSelected, id, data.users)
      : [id];
    if (selectedRows.includes(id))
      // clause to unselect
      setSelectedRows(selectedRows.filter((rowId) => !targetRows.includes(rowId)));
    // clause to select
    else setSelectedRows([...selectedRows, ...targetRows]);
    setLastSelected(id);
  };

  const dialogConfig = {
    [DELETE]: {
      title: 'Are you sure you want to delete this user?',
      submit: () => {
        // needs qs to do array deletes
        selectedRows.map((id) => removeUser(id));
      },
    },
    [REQUEST]: {
      title: 'For what date range would you like users to fill out availabilites for?',
      submit: (start, end, deadline) => {
        console.log(start, end, deadline);
        setDialog('');
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
        <Container>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <MembersHeader
                localChurch="Philadelphia"
                onSearchChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setSearchField(event.target.value)
                }
              />
              <Toolbar
                handleAddOpen={() => setIsNewMemberDialogOpen(!isNewMemberDialogOpen)}
                handleDeleteOpen={() => !!selectedRows.length && setDialog(DELETE)}
                handleRequestOpen={() => setDialog(REQUEST)}
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
              state={dialog === DELETE}
              handleClick={(accepted: boolean) => {
                if (accepted) dialogConfig[dialog].submit();
                else setDialog('');
              }}
              title={dialogConfig[dialog]?.title}
            />
            <NewMemberFormDialog
              state={isNewMemberDialogOpen}
              handleSubmit={addUser}
              handleClose={() => setIsNewMemberDialogOpen(false)}
              title="Add User"
            />
            <RequestAvailabilitiesDialog
              state={dialog === REQUEST}
              handleSubmit={(start, end, deadline) =>
                dialogConfig[dialog].submit(start, end, deadline)
              }
              title={dialogConfig[dialog]?.title}
              handleClose={() => setDialog('')}
            />
          </Grid>
        </Container>
      )}
    </>
  );
};

const filterMembers = (users: UsersDataInterface[], target: string) =>
  users.filter(({ email, firstName, lastName }) => {
    const filterChar = target.toLowerCase();
    return (
      firstName.toLowerCase().includes(filterChar) ||
      lastName.toLowerCase().includes(filterChar) ||
      email.toLowerCase().includes(filterChar)
    );
  });
