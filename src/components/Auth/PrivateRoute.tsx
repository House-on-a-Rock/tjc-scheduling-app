import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { extractTokenInfo, useToken } from '../../shared/utilities';

const validateUser = (condition: string, token): boolean => {
  const userId = token && extractTokenInfo(token, 'userId');
  const access = token && extractTokenInfo(token, 'access');
  const exp = token && extractTokenInfo(token, 'exp');
  return token && !!userId;
};

export const PrivateRoute = ({ children, redirection, condition, ...rest }: any) => {
  const token = useToken();
  const isValidToken = validateUser(condition, token);
  return (
    <Route
      {...rest}
      render={({ location }) => (isValidToken ? children : <Redirect to={redirection} />)}
    />
  );
};
