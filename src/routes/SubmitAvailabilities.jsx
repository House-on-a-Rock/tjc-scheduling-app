import React, { useState, useEffect } from 'react';
import { Switch, Route, useParams, useRouteMatch, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { verifyUserAvailabilities } from '../apis';
import { getURLParams } from '../shared/utilities/helperFunctions';

const SubmitAvailabilities = () => {
  const urlParams = getURLParams();
  useEffect(async () => {
    const token = {
      header: urlParams.get('header'),
      payload: urlParams.get('payload'),
      signature: urlParams.get('signature'),
    };
    async function verifyToken() {
      try {
        const response = await verifyUserAvailabilities({ ...token });
        console.log({ response });
        return response;
      } catch (err) {
        console.log(err);
        return err;
      }
    }
    verifyToken();
  }, []);

  return (
    <Switch>
      <Route></Route>
    </Switch>
  );
};

const useStyles = makeStyles((theme) => ({}));

// SubmitAvailabilities.propTypes = {
//   data: PropTypes.object,
// };

export default SubmitAvailabilities;
