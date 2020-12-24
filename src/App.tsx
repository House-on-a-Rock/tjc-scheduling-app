import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Auth from './routes/auth';
import Main from './routes/main';
import { PrivateRoute } from './components/shared/PrivateRoute';
import { AuthProvider } from './components/shared/AuthProvider';

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
