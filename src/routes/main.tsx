import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { QueryCache, ReactQueryCacheProvider, useQuery } from 'react-query';

import { ReactQueryDevtools } from 'react-query-devtools';
import { ThemeProvider } from '@material-ui/core';

import {
  ScheduleContainer,
  Teams,
  Members,
  Templates,
  Schedule,
  ScheduleDataHandler,
} from '../components';
import { Header } from '../components/shared';
import theme from '../shared/styles/theme';
import { extractTokenInfo, useToken } from '../shared/utilities';
import { AuthContext } from '../shared/services/AuthContext';

const Main = () => {
  const auth = useContext(AuthContext);
  const token = useToken();
  const churchId = parseInt(token && extractTokenInfo(token, 'churchId')[0], 10);

  if (!auth.isLoggedIn) return <Redirect to="/auth/login" />;

  const queryCache = new QueryCache({
    defaultConfig: { queries: { refetchOnWindowFocus: false } },
  });

  return (
    <>
      <ReactQueryCacheProvider queryCache={queryCache}>
        <Router>
          <ThemeProvider theme={theme}>
            <Header />
            <Switch>
              <Route path="/home">
                <ScheduleDataHandler churchId={churchId}>
                  <Schedule />
                </ScheduleDataHandler>
              </Route>
              {/* <Route path="/home">
                <ScheduleContainer churchId={churchId} />
              </Route> */}
              <Route path="/teams">
                <Teams churchId={churchId} />
              </Route>
              <Route path="/templates">
                <Templates churchId={churchId} />
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
            </Switch>
          </ThemeProvider>
        </Router>
        <ReactQueryDevtools initialIsOpen={false} />
      </ReactQueryCacheProvider>
    </>
  );
};

export default Main;
