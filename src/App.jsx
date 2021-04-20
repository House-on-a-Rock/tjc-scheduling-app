import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Auth from './routes/auth';
import Main from './routes/main';
import { PrivateRoute, AuthProvider } from './components/Auth';

import './assets/fonts.css';
import './assets/global.css';

export default function IApp() {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route path="/auth">
            <Auth />
          </Route>
          <PrivateRoute redirection="/auth/login" condition="token" path="/">
            <Main />
          </PrivateRoute>
        </Switch>
      </Router>
    </AuthProvider>
  );
}
