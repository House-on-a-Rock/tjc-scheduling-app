import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

import { ReactQueryDevtools } from 'react-query-devtools';
import { ThemeProvider } from '@material-ui/core';

import { Teams, Members, Template, Schedule } from '../container';
import { Header } from '../components/shared';
import theme from '../shared/styles/theme';
import { extractTokenInfo, useToken } from '../shared/utilities';
import { AuthContext } from '../shared/services/AuthContext';

const Main = () => {
  const auth = useContext(AuthContext);
  const token = useToken();
  const churchId = parseInt(token && extractTokenInfo(token, 'churchId')[0], 10);

  if (!auth.isLoggedIn) return <Redirect to="/auth/login" />;

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
      mutations: {},
    },
  });

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Router>
          <ThemeProvider theme={theme}>
            <Header />
            <Switch>
              <QueryClientProvider client={queryClient}>
                <Route path="/home">
                  <Schedule churchId={churchId} />
                </Route>
                <Route path="/teams">
                  <Teams churchId={churchId} />
                </Route>
                <Route path="/templates">
                  {/* history is messed up. you can't route to a page */}
                  <Template churchId={churchId} />
                </Route>
                <Route path="/members">
                  <Members churchId={churchId} />
                </Route>
                <Route path="/">
                  <Redirect to="/home" />
                </Route>
                {/* <Route>
              <Error404 />
            </Route> */}
              </QueryClientProvider>
            </Switch>
          </ThemeProvider>
        </Router>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </>
  );
};

export default Main;
