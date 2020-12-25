import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import { ErrorPage, Login, ResetPassword, AuthEmail } from '../components/Auth';

const Auth = () => {
  const { path } = useRouteMatch();
  console.log('auth', path);
  return (
    <Switch>
      <Route path={`${path}/login`}>
        <Login />
      </Route>
      <Route path={`${path}/forgotPassword`}>
        <AuthEmail
          data={{
            history: true,
            title: 'Forgot Password',
            description:
              'Lost your password? Please enter your email address. You will receive a link to create a new password via email.',
            button: 'Reset Password',
          }}
        />
      </Route>
      <Route path={`${path}/expiredAccess`}>
        <ErrorPage />
      </Route>
      <Route path={`${path}/resetPassword`}>
        <ResetPassword />
      </Route>
      <Route path={`${path}/`}>
        <Redirect to={`${path}/login`} />
      </Route>
    </Switch>
  );
};

export default Auth;
