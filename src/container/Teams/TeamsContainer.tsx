import React, { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import { UserBank } from '../../components/Teams/UserBank';
import { TeamList } from '../../components/Teams/TeamList';
import {
  TeamState,
  DraggedItem,
  BackendTeamsData,
  MembersData,
  AddedUserRoleData,
} from '../../components/Teams/models';
import { add, reorder } from '../../components/Teams/services';
import { useCreateUserRole } from '../utilities/useMutations';

// TODOS
// 1. need apis that handles title, description changes
// 2. need to figure out how to handle new teams- modal or instantaneous
// 3. new team apis
// 4. validation apis/reducers need to be fleshed out

interface TeamsContainerProps {
  teamsData: BackendTeamsData[];
  users: MembersData[];
}
export const TeamsContainer = ({ teamsData, users }: TeamsContainerProps) => {
  const queryClient = useQueryClient();
  const classes = useStyles();
  const initialState: TeamState = {};
  teamsData.map(
    (team) => (initialState[team.role] = { roleId: team.roleId, members: team.members }),
  );

  const [addedMembers, setAddedMembers] = useState<AddedUserRoleData[]>(null);
  const [deletedMembersIds, setDeletedMemberIds] = useState<string[]>(null);
  const [teams, setTeams] = useState<TeamState>(initialState);
  const [draggedItem, setDraggedItem] = useState<DraggedItem>({
    member: { id: '', userId: '', name: '' },
    source: '',
  });

  const createUserRole = useCreateUserRole();

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <DragDropContextWrapper
          addedMembers={addedMembers}
          handleAddMember={setAddedMembers}
          users={users}
          teams={teams}
          handleTeams={setTeams}
          handleDraggedItem={setDraggedItem}
        >
          <>
            <Grid item md={3} sm={4} xs={12}>
              <UserBank members={users} droppableId="USERBANK" className="userbank" />
            </Grid>
            <Grid item md={9} sm={8} xs={12}>
              <TeamList users={users} teams={teams} draggedMember={draggedItem} />
              <Button
                onClick={() => {
                  if (addedMembers !== null)
                    addedMembers.map((addedMember) => {
                      createUserRole.mutate(addedMember);
                    });
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
  addedMembers: AddedUserRoleData[];
  handleAddMember: (newList: AddedUserRoleData[]) => void;
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
          console.log(destination);
          if (addedMembers !== null)
            handleAddMember([
              ...addedMembers,
              {
                userId: users[source.index].userId,
                roleId: teams[destination.droppableId].roleId,
              },
            ]);
          else
            handleAddMember([
              {
                userId: users[source.index].userId,
                roleId: teams[destination.droppableId].roleId,
              },
            ]);
          handleTeams(add(users, teams, source, destination));
          break;
        default:
          break;
      }
    },
    [handleTeams],
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
