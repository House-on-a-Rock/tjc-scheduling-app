import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import axios from 'axios';
import Auth from './routes/Auth';
import history from './history';
import { PrivateRoute } from './components/shared/PrivateRoute';
import Main from './routes/Main';

async function checkCredentials() {
  const { data, status } = await axios.post(
    `http://localhost:8080/api/authentication/login`,
    {
      email: 'philadelphia@tjc.org',
      password: 'philly',
    },
  );
  console.log('checking credentials', status, data);
}

// export const App = () => {
//   function handleLogin() {
//     checkCredentials();
//   }
//   handleLogin();

//   return <div>App</div>;
// };

export default function IApp() {
  function handleLogin() {
    checkCredentials();
  }
  handleLogin();
  return (
    <Router history={history}>
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
