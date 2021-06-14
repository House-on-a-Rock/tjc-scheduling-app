import React, { useState, useEffect } from 'react';
import { Switch } from 'react-router-dom';
import PropTypes from 'prop-types';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { PrivateRoute } from '../components/Auth';
import { verifyUserAvailabilities } from '../apis';
import { getURLParams } from '../shared/utilities/helperFunctions';
import { setLocalStorageState, removeLocalStorageState } from '../shared/utilities';

const SubmitAvailabilities = () => {
  const urlParams = getURLParams();
  const [checkingToken, setCheckingToken] = useState(true);
  useEffect(async () => {
    const token = {
      header: urlParams.get('header'),
      payload: urlParams.get('payload'),
      signature: urlParams.get('signature'),
    };
    async function verifyToken() {
      setCheckingToken(true);
      try {
        const response = await verifyUserAvailabilities({ ...token });
        setLocalStorageState(
          'access_token',
          `${token.header}.${token.payload}.${token.signature}`,
        );
        setCheckingToken(false);
        return response;
      } catch (err) {
        console.log(err);
        removeLocalStorageState('access_token');
        return setCheckingToken(false);
      }
    }
    verifyToken();
  }, []);

  return (
    <Switch>
      {!checkingToken && (
        <PrivateRoute path="/" redirection="/error" condition="token">
          Submit Availabilities
        </PrivateRoute>
      )}
    </Switch>
  );
};

// const useStyles = makeStyles((theme) => ({}));

// SubmitAvailabilities.propTypes = {
//   data: PropTypes.object,
// };

export default SubmitAvailabilities;
