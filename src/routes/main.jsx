import { useContext, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import { ReactQueryDevtools } from 'react-query/devtools';

// import { Teams } from 'features/Teams';
// import { ScheduleContainer } from 'features/Schedule';
// import { MembersContainer } from 'features/Member';
// import { TemplateContainer } from 'features/Template';
// import { Header } from 'features/shared';
import theme from '../shared/styles/theme';
import { extractTokenInfo, useToken } from '../shared/utilities';
import AuthContext from '../shared/services/AuthContext';
import Alert from '@components/Alert/index';

const Main = () => {
  const auth = useContext(AuthContext);
  const token = useToken();
  const churchId = parseInt(token && extractTokenInfo(token, 'churchId')[0], 10);
  const [alert, setAlert] = useState(null);

  if (!auth.isLoggedIn) return <Redirect to="/auth/login" />;

  return (
    <>
      <Router>
        <ThemeProvider theme={theme}>
          {/* <Header /> */}
          {/* {alert && (
            <Alert alert={alert} isOpen={!!alert} handleClose={() => setAlert(null)} />
          )} */}
          <Alert />

          <Switch>
            {/* <Route path="/home">
              <ScheduleContainer churchId={churchId} setAlert={setAlert} />
            </Route>
            <Route path="/teams">
              <Teams churchId={churchId} setAlert={setAlert} />
            </Route>
            <Route path="/templates">
              <TemplateContainer churchId={churchId} setAlert={setAlert} />
            </Route>
            <Route path="/users">
              <MembersContainer churchId={churchId} setAlert={setAlert} />
            </Route> */}
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
    </>
  );
};

export default Main;
