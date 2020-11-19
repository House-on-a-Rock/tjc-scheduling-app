import React, { useState } from 'react';
import { useQuery, useMutation, useQueryCache } from 'react-query';

// material UI
import Grid from '@material-ui/core/Grid';

// shared components
import { ConfirmationDialog } from '../../shared/ConfirmationDialog';
import { FormDialog } from '../../shared/FormDialog';

// member page components
import { MembersHeader } from './MembersHeader';
import { MembersTable } from './MembersTable';

import history from '../../../history';
import { addUser, deleteUser } from '../../../store/apis';
import { isValidEmail, useSelector } from '../../../shared/utilities';
import { updateSelectedRows } from './utilities';
import { MemberStateData } from '../../../store/types';
import { getChurchMembersData } from '../../../query';
import { AddUserProps } from '../../../shared/types';
// import { deleteMembers } from '../../../store/actions';

export const Members = () => {
  // hooks
  const { churchId, name: churchName } = useSelector((state) => state.profile);

  // useQuery hooks
  // how to handle errors or no members
  const cache = useQueryCache();
  const { isLoading, error, data = [] } = useQuery(
    ['roleData', churchId],
    // how to handle errors or no members
    getChurchMembersData,
    {
      staleTime: 300000,
      cacheTime: 3000000,
      refetchOnWindowFocus: false, // these dont work properly eugh
      refetchOnMount: false,
      enabled: !!churchId,
    },
  );
  const [mutateAddUser] = useMutation(addUser, {
    onSuccess: () => cache.invalidateQueries('roleData'), // causes the roleData query to call and update on success
  });
  const [mutateRemoveUser] = useMutation(deleteUser, {
    onSuccess: () => cache.invalidateQueries('roleData'),
  });

  // Component state
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [searchField, setSearchField] = useState<string>('');
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState<boolean>(false);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState<boolean>(false);
  const [lastSelected, setLastSelected] = useState<number>(-1);

  if (isLoading) return <h1>Loading</h1>;
  if (error) history.push('/auth/login');

  const isSelected: (arg: number) => boolean = (id: number) => selectedRows.includes(id);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) =>
    event.target.checked
      ? setSelectedRows(data.map(({ userId }: MemberStateData) => userId))
      : setSelectedRows([]);

  const handleDeleteMembers = () => {
    try {
      selectedRows.map(async (member) => mutateRemoveUser(member)); // removed await, unsure if this is right
    } catch (err) {
      console.log('uh oh cant delete this guy too stonks');
    }
    setSelectedRows([]);
  };

  const onCloseAddMemberDialog = async (
    shouldAdd: boolean,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) => {
    if (
      shouldAdd &&
      firstName &&
      lastName &&
      email &&
      password &&
      isValidEmail(email) &&
      churchId
    ) {
      const mutateAddUserVars: AddUserProps = {
        email,
        firstName,
        lastName,
        password,
        churchId,
      };
      await mutateAddUser(mutateAddUserVars);
    }
    setIsAddMemberDialogOpen(false);
  };

  const handleRowClick = (
    event: React.MouseEvent<unknown>,
    { userId: id }: MemberStateData,
  ) => {
    event.stopPropagation();
    const updatedRows: number[] = event.shiftKey
      ? updateSelectedRows(lastSelected, id, data)
      : [id];
    if (selectedRows.includes(id))
      setSelectedRows(selectedRows.filter((rowId) => !updatedRows.includes(rowId)));
    else setSelectedRows([...selectedRows, ...updatedRows]);

    setLastSelected(id);
  };

  const filteredMembers: MemberStateData[] = data.filter(
    ({ email, firstName, lastName }: MemberStateData) => {
      const filterChar: string = searchField.toLowerCase();
      return (
        firstName.toLowerCase().includes(filterChar) ||
        lastName.toLowerCase().includes(filterChar) ||
        email.toLowerCase().includes(filterChar)
      );
    },
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <MembersHeader
          localChurch={churchName}
          onSearchChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setSearchField(event.target.value)
          }
          handleAddOpen={() => setIsAddMemberDialogOpen(!isAddMemberDialogOpen)}
          handleDeleteOpen={() =>
            !!selectedRows.length && setIsConfirmDialogOpen(!isConfirmDialogOpen)
          }
        />
        <MembersTable
          members={filteredMembers}
          selectedRowLength={selectedRows.length}
          isSelected={isSelected}
          handleCheck={handleSelectAllClick}
          handleClick={handleRowClick}
        />
      </Grid>
      <ConfirmationDialog
        isOpen={isConfirmDialogOpen}
        handleClick={(shouldDelete: boolean) => {
          setIsConfirmDialogOpen(!isConfirmDialogOpen);
          if (shouldDelete) handleDeleteMembers();
        }}
        title="Confirm Delete Action"
      />
      <FormDialog
        isOpen={isAddMemberDialogOpen}
        handleClose={onCloseAddMemberDialog}
        title="Add User"
      />
    </Grid>
  );
};
