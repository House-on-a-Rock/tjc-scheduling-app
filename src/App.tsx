import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Auth from './routes/Auth';
import { PrivateRoute } from './components/shared/PrivateRoute';
import Main from './routes/Main';

export default function IApp() {
  return (
    <Router>
      <Switch>
        <Route path="/auth">
          <Auth />
        </Route>
        <PrivateRoute path="/">
          <Main />
        </PrivateRoute>
      </Switch>
    </Router>
  );
}
