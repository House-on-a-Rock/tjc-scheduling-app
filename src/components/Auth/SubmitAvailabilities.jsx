import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

// Custom

import { isValidEmail } from '../../shared/utilities/helperFunctions';
import { recoverEmail } from '../../apis';

const SubmitAvailabilities = () => {
  const classes = useStyles();
  console.log('hello');
  const params = useParams();
  console.log('Entered Submit Availabilities', { params });

  return (
    <Container component="main" maxWidth="xs">
      <>hi</>
    </Container>
  );
};

const useStyles = makeStyles((theme) => ({
  // paper: {
  //   marginTop: theme.spacing(25),
  //   display: 'flex',
  //   flexDirection: 'column',
  //   alignItems: 'center',
  // },
  // avatar: {
  //   margin: theme.spacing(1),
  //   backgroundColor: theme.palette.secondary.main,
  // },
  // form: {
  //   width: '100%', // Fix IE 11 issue.
  //   marginTop: theme.spacing(1),
  // },
  // submit: {
  //   margin: theme.spacing(3, 0, 2),
  // },
  // buttonRow: { display: 'flex', justifyContent: 'space-between' },
}));

// SubmitAvailabilities.propTypes = {
//   data: PropTypes.object,
// };

export default SubmitAvailabilities;
