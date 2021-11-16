import { initReactQueryAuth } from 'react-query-auth';

import { Spinner } from '@components/loading';
// import {
//   loginWithEmailAndPassword,
//   getUser,
//   registerWithEmailAndPassword,
// } from '@features/auth';
import { tokenStorage } from 'utils/storage';
import { authenticateLogin } from 'apis/auth';

async function handleUserResponse(data) {
  const { jwt, user } = data;
  tokenStorage.setToken(jwt);
  return user;
}

async function loadUser() {
  if (tokenStorage.getToken()) {
    // const data = await getUser();
    // return data;
  }
  return null;
}

async function loginFn(data) {
  // const response = await loginWithEmailAndPassword(data);
  // const user = await handleUserResponse(response);
  const response = await authenticateLogin(data);
  // return user;
}

async function registerFn(data) {
  // const response = await registerWithEmailAndPassword(data);
  // const user = await handleUserResponse(response);
  return {};
}

async function logoutFn() {
  tokenStorage.clearToken();
  window.location.assign(window.location.origin);
}

const authConfig = {
  loadUser,
  loginFn,
  registerFn,
  logoutFn,
  LoaderComponent() {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <Spinner size="xl" />
      </div>
    );
  },
};

export const { AuthProvider, useAuth } = initReactQueryAuth(authConfig);
