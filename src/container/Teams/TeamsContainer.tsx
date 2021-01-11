import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import { UserBank } from '../../components/Teams/UserBank';
import { TeamList } from '../../components/Teams/TeamList';
import {
  TeamState,
  DraggedItem,
  BackendTeamsData,
  MembersData,
} from '../../components/Teams/models';
import { add, reorder } from '../../components/Teams/services';

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
  const classes = useStyles();
  const initialState: TeamState = {};
  teamsData.map((team) => (initialState[team.role] = team.members));

  const [teams, setTeams] = useState<TeamState>(initialState);
  const [draggedItem, setDraggedItem] = useState<DraggedItem>({
    member: { id: '', name: '' },
    source: '',
  });

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <DragDropContextWrapper
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
              <TeamList teams={teams} draggedMember={draggedItem} />
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
  handleTeams: (state: TeamState) => void;
  handleDraggedItem: (draggedMember: DraggedItem) => void;
  children: JSX.Element;
}

const DragDropContextWrapper = ({
  users,
  teams,
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
        member: { id: '', name: '' },
        source: '', // always reset (cleans up classes)
      });
      if (!destination) return;
      switch (source.droppableId) {
        case destination.droppableId:
          handleTeams(reorder(teams, source, destination));
          break;
        case 'USERBANK':
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
