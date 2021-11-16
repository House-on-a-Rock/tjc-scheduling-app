import React from 'react';
import PropTypes from 'prop-types';

// Material UI Components
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import DroppableTeamMembersList from './DroppableTeamMemberList';
import { cardTheme } from '../../shared/styles/theme';
import { verticalScrollIndicatorShadow } from '../../shared/styles/scroll-indicator-shadow';

const TeamCard = ({ type, members, draggedItem }) => {
  const classes = useStyles();
  const canDrop = () =>
    draggedItem.source === 'USERBANK'
      ? !members.map((member) => member.name).includes(draggedItem.member.name)
      : draggedItem.source === type || draggedItem.source === '';

  return (
    <Card className={classes.root}>
      <CardContent className={classes.details}>
        <Typography component="h5" variant="h5">
          {type}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Write a long form description here
        </Typography>
      </CardContent>
      <Divider orientation="vertical" className={classes.divider} />
      <CardContent className={classes.list} style={{ overflow: 'auto' }}>
        <DroppableTeamMembersList
          role={type}
          canDrop={canDrop}
          members={members}
          draggedItem={draggedItem}
        />
      </CardContent>
    </Card>
  );
};

const useStyles = makeStyles(() => ({
  root: {
    ...cardTheme,
    display: 'flex',
    margin: '.5em',
    height: '20vh',
    borderRadius: '5px',
    transition: '0',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  divider: {
    height: '90%',
    margin: '1em 0',
    position: 'relative',
    top: '-0.5em',
  },
  list: {
    ...verticalScrollIndicatorShadow('white'),
    alignItems: 'center',
    justifyContent: 'center',
    width: '79%',
  },
}));

TeamCard.propTypes = {
  type: PropTypes.string,
  members: PropTypes.array,
  draggedItem: PropTypes.object,
};

export default TeamCard;
