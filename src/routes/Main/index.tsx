import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { QueryCache, ReactQueryCacheProvider, useQuery } from 'react-query';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ReactQueryDevtools } from 'react-query-devtools';
import { ThemeProvider } from '@material-ui/core';

import { Home, Teams, Members } from '../../components/Main';
import { Header } from '../../components/shared/Header';
import { Error404 } from '../../components/shared';
import '../../assets/fonts.css';
import '../../assets/global.css';
import theme from '../../shared/styles/theme';
import { extractUserId } from '../../shared/utilities';
import { getUserData, getScheduleData } from '../../query';
import { loadProfile } from '../../store/actions/profileActions';

const Main = () => {
  console.log('HELLOOO PEOPLE');
  const queryCache = new QueryCache({
    defaultConfig: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });
  const dispatch = useDispatch();

  // Need a better handle of isLoading, error, data
  const { isLoading, error: userError, data: profile } = useQuery(
    ['profile', extractUserId(localStorage.getItem('access_token') ?? '')],
    getUserData,
    { refetchOnWindowFocus: false, staleTime: 100000000000000 },
  );

  useEffect(() => {
    if (profile)
      dispatch(loadProfile({ churchId: profile.churchId, name: profile.church.name }));
  }, [profile, dispatch]); // https://www.reddit.com/r/reactjs/comments/fpckcr/react_hook_useeffect_has_a_missing_dependency/

  return (
    <>
      <ReactQueryCacheProvider queryCache={queryCache}>
        <Router>
          <ThemeProvider theme={theme}>
            <Header />

            <Switch>
              <Route path="/home">
                <Home />
              </Route>
              <Route exact path="/">
                <Redirect to="/home" />
              </Route>
              <Route path="/teams">
                <Teams />
              </Route>
              <Route path="/members">
                <Members />
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
