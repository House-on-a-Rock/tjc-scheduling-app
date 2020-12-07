import React from 'react';
import { Route, Redirect, useLocation } from 'react-router-dom';
import { useSelector } from '../../shared/utilities';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export const PrivateRoute = ({ children, ...rest }: any) => {
  const query = useQuery();
  const isLoggedIn = useSelector(({ auth }) => auth.isLoggedIn);
  return (
    <Route
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
      render={({ location }) => (isLoggedIn ? children : <Redirect to="/auth/login" />)}
    />
  );
};
