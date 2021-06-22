import React from 'react';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Auth from './routes/auth';
import Main from './routes/main';
import { PrivateRoute, AuthProvider } from './components/Auth';
import { QueryClient, QueryClientProvider } from 'react-query';

import './assets/fonts.css';
import './assets/global.css';

export default function IApp() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
      mutations: {},
    },
  });

  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route path="/auth">
            <Auth />
          </Route>
          <QueryClientProvider client={queryClient}>
            <PrivateRoute redirection="/auth/login" condition="token" path="/">
              <Main />
            </PrivateRoute>
          </QueryClientProvider>
          <Route path="/submit-availabilities/:tokenId">{/* <TBD /> */}</Route>
        </Switch>
      </Router>
    </AuthProvider>
  );
}
