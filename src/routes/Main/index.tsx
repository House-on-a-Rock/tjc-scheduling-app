import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { ReactQueryDevtools } from 'react-query-devtools';
import { QueryCache, ReactQueryCacheProvider, useQuery } from 'react-query';

// import { Home, Teams, Members } from '../../components/Main';
// import { Header } from '../../components/shared/Header';
// import { ThemeProvider } from '@material-ui/core';
// import { Error404 } from '../../components/shared';
// import theme from '../../shared/styles/theme';
// import { extractUserId } from '../../shared/utilities';
// import { getUserData } from '../../query/users';
// import { loadProfile } from '../../store/actions/profileActions';
// import { getScheduleData } from '../../query/schedules';
// import '../../assets/fonts.css';
// import '../../assets/global.css';

const Main = () => {
  const queryCache = new QueryCache({
    defaultConfig: {
      queries: {
        refetchOnWindowFocus: false,
        // refetchOnMount: false,
      },
    },
  });
  const dispatch = useDispatch();

  // // Need a better handle of isLoading, error, data
  // const { isLoading, error: userError, data: profile } = useQuery(
  //   ['profile', extractUserId(localStorage.getItem('access_token'))],
  //   getUserData,
  //   { refetchOnWindowFocus: false, staleTime: 100000000000000 },
  // );

  // useEffect(() => {
  //   if (profile)
  //     dispatch(loadProfile({ churchId: profile.churchId, name: profile.church.name }));
  // }, [profile]);

  return (
    <>
      <ReactQueryCacheProvider queryCache={queryCache}>
        <Router>
          {/* <ThemeProvider theme={theme}>
            <Header />

            <Switch>
              <Route path={'/home'}>
                <Home />
              </Route>
              <Route exact path="/">
                <Redirect to="/home" />
              </Route>
              <Route path={'/teams'}>
                <Teams />
              </Route>
              <Route path={'/members'}>
                <Members />
              </Route>
              <Route>
              <Error404 />
            </Route>
            </Switch>
          </ThemeProvider> */}
        </Router>
        <ReactQueryDevtools initialIsOpen={false} />
      </ReactQueryCacheProvider>
    </>
  );
};

export default Main;
