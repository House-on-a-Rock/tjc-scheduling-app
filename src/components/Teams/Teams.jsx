import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import { UserBank } from './UserBank';
import TeamList from './TeamList';
import { add, reorder } from './services';

// TODOS
// 1. need apis that handles title, description changes
// 2. need to figure out how to handle new teams- modal or instantaneous
// 3. new team apis
// 4. validation apis/reducers need to be fleshed out
// 5. container this thing

const Teams = () => {
  const classes = useStyles();
  const initialState = {};
  // TEAMS.map((team) => (initialState[team.role] = team.members));

  const [teams, setTeams] = useState(initialState);
  const [draggedItem, setDraggedItem] = useState({
    member: { id: '', name: '' },
    source: '',
  });

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <DragDropContextWrapper
          teams={teams}
          handleTeams={setTeams}
          handleDraggedItem={setDraggedItem}
        >
          <>
            <Grid item md={3} sm={4} xs={12}>
              {/* <UserBank members={MEMBERS} droppableId="USERBANK" className="userbank" /> */}
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

const DragDropContextWrapper = ({ teams, handleTeams, handleDraggedItem, children }) => {
  // const onDragStart = useCallback(
  //   ({ source }) => {
  //     handleDraggedItem({ member: MEMBERS[source.index], source: source.droppableId });
  //   },
  //   [handleDraggedItem],
  // );

  const onDragEnd = useCallback(
    ({ source, destination }) => {
      handleDraggedItem({
        member: { id: '', name: '' },
        source: '', // always reset (cleans up classes)
      });
      // if (!destination) return;
      // switch (source.droppableId) {
      //   case destination.droppableId:
      //     handleTeams(reorder(teams, source, destination));
      //     break;
      //   case 'USERBANK':
      //     handleTeams(add(MEMBERS, teams, source, destination));
      //     break;
      //   default:
      //     break;
      // }
    },
    [handleTeams],
  );
  // return (
  //   <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
  //     {children}
  //   </DragDropContext>
  // );
};

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
  },
}));

export default Teams;
