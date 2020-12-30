import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../../shared/services/AuthContext';
import { extractTokenInfo, useToken } from '../../shared/utilities';

const validateUser = (condition: string, token): boolean => {
  const userId = token && extractTokenInfo(token, 'userId');
  const access = token && extractTokenInfo(token, 'access');
  const exp = token && extractTokenInfo(token, 'exp');
  return token && !!userId;
};

interface PrivateRouteProps {
  redirection: string;
  path: string;
  condition: string;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  redirection,
  condition,
  ...rest
}) => {
  const auth = useContext(AuthContext);
  const logout = () => {
    auth.logout();
  };
  const token = useToken();
  const isValidToken = validateUser(condition, token);
  if (!isValidToken) logout();
  return (
    <Route
      {...rest}
      render={({ location }) => (isValidToken ? children : <Redirect to={redirection} />)}
    />
  );
};
