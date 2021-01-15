import React, { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { v4 as uuid } from 'uuid';

import { UserBank } from '../../components/Teams/UserBank';
import { TeamList } from '../../components/Teams/TeamList';
import {
  TeamState,
  DraggedItem,
  BackendTeamsData,
  MembersData,
  UserRoleData,
  BackendUsersData,
} from '../../components/Teams/models';
import { add, reorder } from '../../components/Teams/services';
import { useCreateUserRole, useDeleteUserRole } from '../utilities/useMutations';

// TODOS
// 1. need apis that handles title, description changes
// 2. need to figure out how to handle new teams- modal or instantaneous
// 3. new team apis
// 4. validation apis/reducers need to be fleshed out

interface TeamsContainerProps {
  teamsData: BackendTeamsData[];
  usersData: BackendUsersData[];
}
export const TeamsContainer = ({ teamsData, usersData }: TeamsContainerProps) => {
  const queryClient = useQueryClient();
  const classes = useStyles();
  const initialState: TeamState = {};
  const formattedUserData: MembersData[] = [];
  usersData.map((user) => {
    formattedUserData.push({
      id: uuid(),
      userId: user.userId,
      name: `${user.firstName} ${user.lastName}`,
    });
  });

  teamsData.map(
    (team) => (initialState[team.role] = { roleId: team.roleId, members: team.members }),
  );

  const [addedMembers, setAddedMembers] = useState<UserRoleData[]>(null);
  const [deletedMembers, setDeletedMembers] = useState<UserRoleData[]>(null);
  const [teams, setTeams] = useState<TeamState>(initialState);
  const [draggedItem, setDraggedItem] = useState<DraggedItem>({
    member: { id: '', userId: '', name: '' },
    source: '',
  });

  const createUserRole = useCreateUserRole();
  const deleteUserRole = useDeleteUserRole();

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <DragDropContextWrapper
          addedMembers={addedMembers}
          handleAddMember={setAddedMembers}
          users={formattedUserData}
          teams={teams}
          handleTeams={setTeams}
          handleDraggedItem={setDraggedItem}
        >
          <>
            <Grid item md={3} sm={4} xs={12}>
              <UserBank
                members={formattedUserData}
                droppableId="USERBANK"
                className="userbank"
              />
            </Grid>
            <Grid item md={9} sm={8} xs={12}>
              <TeamList
                deletedMembers={deletedMembers}
                setDeletedMembers={setDeletedMembers}
                users={formattedUserData}
                teams={teams}
                draggedMember={draggedItem}
              />
              <Button
                onClick={() => {
                  if (addedMembers !== null)
                    addedMembers.map((addedMember) => {
                      createUserRole.mutate(addedMember);
                    });
                  if (deletedMembers !== null)
                    deletedMembers.map((deletedMember) => {
                      deleteUserRole.mutate(deletedMember);
                    });
                  setAddedMembers(null);
                  setDeletedMembers(null);
                  queryClient.invalidateQueries('teams');
                }}
              >
                Save
              </Button>
            </Grid>
          </>
        </DragDropContextWrapper>
      </Grid>
    </div>
  );
};

interface DragDropContextWrapperProps {
  users: MembersData[];
  teams: TeamState;
  addedMembers: UserRoleData[];
  handleAddMember: (newList: UserRoleData[]) => void;
  handleTeams: (state: TeamState) => void;
  handleDraggedItem: (draggedMember: DraggedItem) => void;
  children: JSX.Element;
}

const DragDropContextWrapper = ({
  users,
  teams,
  addedMembers,
  handleAddMember,
  handleTeams,
  handleDraggedItem,
  children,
}: DragDropContextWrapperProps) => {
  const onDragStart: (result: DropResult) => void = useCallback(
    ({ source }: DropResult) => {
      handleDraggedItem({ member: users[source.index], source: source.droppableId });
    },
    [handleDraggedItem],
  );

  const onDragEnd: (result: DropResult) => void = useCallback(
    ({ source, destination }: DropResult) => {
      handleDraggedItem({
        member: { id: '', userId: '', name: '' },
        source: '', // always reset (cleans up classes)
      });
      if (!destination) return;
      switch (source.droppableId) {
        case destination.droppableId:
          handleTeams(reorder(teams, source, destination));
          break;
        case 'USERBANK':
          if (addedMembers !== null) {
            handleAddMember([
              ...addedMembers,
              {
                userId: users[source.index].userId,
                roleId: teams[destination.droppableId].roleId,
              },
            ]);
          } else {
            handleAddMember([
              {
                userId: users[source.index].userId,
                roleId: teams[destination.droppableId].roleId,
              },
            ]);
          }
          handleTeams(add(users, teams, source, destination));
          break;
        default:
          break;
      }
    },
    [handleTeams, addedMembers],
  );
  return (
    <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
      {children}
    </DragDropContext>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
  },
}));
