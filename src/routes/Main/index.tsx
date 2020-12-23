import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { QueryCache, ReactQueryCacheProvider, useQuery } from 'react-query';

import { ReactQueryDevtools } from 'react-query-devtools';
import { ThemeProvider } from '@material-ui/core';

import { Home, Teams, Members } from '../../components/Main';
import { Header } from '../../components/shared/Header';
import theme from '../../shared/styles/theme';
import { extractTokenInfo, getLocalStorageItem } from '../../shared/utilities';
import { getUserData, getScheduleData } from '../../query';
import { loadProfile } from '../../store/actions/profileActions';

import '../../assets/fonts.css';
import '../../assets/global.css';
import { Templates } from '../../components/Main/Templates/Templates';

const Main = () => {
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
    ['profile', extractTokenInfo(getLocalStorageItem('access_token'), 'userId')],
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
              <Route path="/templates">
                <Templates />
              </Route>
              <Route path="/teams">
                <Teams />
              </Route>
              <Route path="/members">
                <Members />
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
