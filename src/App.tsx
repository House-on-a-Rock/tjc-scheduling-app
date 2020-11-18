import React from 'react';
import axios from 'axios';

async function checkCredentials() {
  const { data, status } = await axios.post(
    `http://localhost:8080/api/authentication/login`,
    {
      email: 'philadelphia@tjc.org',
      password: 'philly',
    },
  );
  console.log(status, data);
}

export const App = () => {
  function handleLogin() {
    checkCredentials();
  }
  handleLogin();

  return <div>App</div>;
};
