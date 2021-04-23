import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider } from '@material-ui/core';

// import { Teams, Members, Template, Schedule } from '../container';
import { Teams } from '../components/Teams';
import { ScheduleContainer } from '../components/Schedule';
import { MembersContainer } from '../components/Member';
import { TemplateContainer } from '../components/Template';
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
              <Route path="/home">
                <ScheduleContainer churchId={churchId} />
              </Route>
              <Route path="/teams">
                <Teams churchId={churchId} />
              </Route>
              <Route path="/templates">
                {/* history is messed up. you can't route to a page */}
                <TemplateContainer churchId={churchId} />
              </Route>
              <Route path="/members">
                <MembersContainer churchId={churchId} />
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
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </>
  );
};

export default Main;