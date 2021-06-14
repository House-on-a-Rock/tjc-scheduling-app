import React from 'react';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Auth from './routes/auth';
import Main from './routes/main';
import SubmitAvailabilities from './routes/SubmitAvailabilities';
import { PrivateRoute, AuthProvider } from './components/Auth';

import './assets/fonts.css';
import './assets/global.css';
// import { ErrorPage } from './components/shared';

export default function IApp() {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route path="/auth">
            <Auth />
          </Route>
          <Route path="/submit-availabilities">
            <SubmitAvailabilities />
          </Route>
          {/* <Route path="/error">
            <ErrorPage />
          </Route> */}
          <PrivateRoute path="/" redirection="/auth/login" condition="token">
            <Main />
          </PrivateRoute>
        </Switch>
      </Router>
    </AuthProvider>
  );
}
