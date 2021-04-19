import React from 'react';

// Material UI Components
import { makeStyles, Theme } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { TeamCard } from './TeamCard';


export const TeamList = ({ teams, draggedMember }) => {
  return (
    <>
      <Typography variant="h4" align="center">
        Teams
      </Typography>
      {Object.keys(teams).map((role, index) => (
        <TeamCard
          key={`team-${index}`}
          type={role}
          members={Object.values(teams)[index]}
          draggedItem={draggedMember}
        />
      ))}
      <NewTeamCard />
    </>
  );
};

const NewTeamCard = ({ handleClick }) => {
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      <CardContent className={classes.cardDetails}>
        <IconButton>
          <AddIcon />
        </IconButton>
      </CardContent>
    </Card>
  );
};

const useStyles = makeStyles((theme) => ({
  card: {
    display: 'flex',
    margin: '.5em',
    height: '20vh',
  },
  cardDetails: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '15vw',
  },
}));
