import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import {
  extractTokenInfo,
  getLocalStorageItem,
  useSelector,
} from '../../shared/utilities';

const validateUser = (condition: string): boolean => {
  const token =
    typeof getLocalStorageItem('access_token') === 'string'
      ? getLocalStorageItem('access_token')
      : null;
  const validToken = token && extractTokenInfo(token, 'userId');
  // const isAdmin = extractTokenInfo(token, 'access');
  return condition === 'token' ?? !!validToken;
};

export const PrivateRoute = ({ children, redirection, condition, ...rest }: any) => {
  const isLoggedIn = useSelector(({ auth }) => auth.isLoggedIn);
  const isValidToken = validateUser(condition);

  return (
    <Route
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
      render={({ location }) => (isLoggedIn ? children : <Redirect to={redirection} />)}
    />
  );
};
