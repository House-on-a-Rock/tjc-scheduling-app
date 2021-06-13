import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import {
  ErrorPage,
  Login,
  ResetPassword,
  AuthEmail,
  SubmitAvailabilities,
} from '../components/Auth';

const Auth = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/login`}>
        <Login />
      </Route>
      <Route path={`${path}/forgot-password`}>
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
      <Route path={`${path}/expired-access`}>
        <ErrorPage />
      </Route>
      <Route path={`${path}/reset-password`}>
        <ResetPassword />
      </Route>
      <Route path={`${path}/submit-availabilities/:token`}>
        <SubmitAvailabilities />
      </Route>
      <Route path={`${path}/`}>
        <Redirect to={`${path}/login`} />
      </Route>
    </Switch>
  );
};

export default Auth;
