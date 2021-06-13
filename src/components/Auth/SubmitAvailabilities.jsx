import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const SubmitAvailabilities = () => {
  const classes = useStyles();
  const params = useParams();

  return (
    <Container component="main" maxWidth="xs">
      <>hi</>
    </Container>
  );
};

const useStyles = makeStyles((theme) => ({}));

// SubmitAvailabilities.propTypes = {
//   data: PropTypes.object,
// };

export default SubmitAvailabilities;
