/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {
  Droppable,
  Draggable,
  DroppableProvided,
  DroppableStateSnapshot,
  DraggableProvided,
  DraggableStateSnapshot,
  DroppableId,
} from 'react-beautiful-dnd';

// Material UI Components
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Paper from '@material-ui/core/Paper';
import { MembersData } from './models';
import { getRenderItem } from './services';
import './UserBank.css';
import {
  transitionTheme,
  sideBarTheme,
  buttonTheme,
} from '../../../shared/styles/theme.js';
import { verticalScrollIndicatorShadow } from '../../../shared/styles/scroll-indicator-shadow';

interface UserBankProps {
  members: MembersData[];
  className: string;
  droppableId: DroppableId;
}

export const UserBank = ({ members, className, droppableId }: UserBankProps) => {
  const classes = useStyles();
  const churchName = 'Philadelphia';
  return (
    <Paper className={classes.root}>
      <DroppableBank
        members={members}
        className={className}
        droppableId={droppableId}
        church={churchName}
      />
    </Paper>
  );
};

interface DroppableBankProps {
  members: MembersData[];
  className: string;
  droppableId: DroppableId;
  church: string;
}

const DroppableBank = ({
  members,
  className,
  droppableId,
  church,
}: DroppableBankProps) => {
  const classes = useStyles();
  return (
    <Droppable
      renderClone={getRenderItem(members, className)}
      droppableId={droppableId}
      isDropDisabled
    >
      {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
        <List dense ref={provided.innerRef}>
          <ListSubheader className={classes.listSubheader}>
            {`List of ${church} church members`}
          </ListSubheader>
          {members.map((member: MembersData, index: number) => {
            const shouldRenderClone = member.id === snapshot.draggingFromThisWith;
            return (
              <React.Fragment key={member.id}>
                {shouldRenderClone ? (
                  <ListItem className={`react-beautiful-dnd-copy ${classes.member}`}>
                    <ListItemText id={member.id} primary={member.name} />
                  </ListItem>
                ) : (
                  <Draggable index={index} draggableId={member.id}>
                    {(
                      childProvided: DraggableProvided,
                      childSnapshot: DraggableStateSnapshot,
                    ) => (
                      <ListItem
                        ref={childProvided.innerRef}
                        {...childProvided.draggableProps}
                        {...childProvided.dragHandleProps}
                        className={`${childSnapshot.isDragging ? 'dragging' : ''} ${
                          classes.member
                        }`}
                      >
                        <ListItemText id={member.id} primary={member.name} />
                      </ListItem>
                    )}
                  </Draggable>
                )}
              </React.Fragment>
            );
          })}
          {provided.placeholder}
        </List>
      )}
    </Droppable>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      ...verticalScrollIndicatorShadow('#edeef3'),
      backgroundColor: sideBarTheme.backgroundColor,
      boxShadow: sideBarTheme.boxShadow,
      borderRadius: 0,
      padding: '0 1rem',
      maxHeight: '90vh',
      overflow: 'auto',
    },
    listSubheader: {
      fontSize: theme.typography.h3.fontSize,
      color: theme.typography.h3.color,
      position: 'static',
    },
    member: {
      transition: transitionTheme.fast,
      '&:hover, &:focus': {
        backgroundColor: buttonTheme.filled.hover.backgroundColor,
        boxShadow: buttonTheme.filled.boxShadow,
        borderRadius: '0.5rem',
        color: 'white',
      },
    },
    placeHolder: {
      display: 'none',
    },
  }),
);
