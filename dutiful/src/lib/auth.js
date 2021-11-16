import { initReactQueryAuth } from 'react-query-auth';
import { Spinner } from '@components/loading';

import { tokenStorage } from 'utils/storage';
import { authenticate } from 'apis/auth';

import { extractTokenInfo } from 'utils/extractTokenInfo';

async function handleUserResponse({ data }) {
  const { token } = data;
  const user = extractTokenInfo(token, 'user');
  tokenStorage.setToken(token);
  return user;
}

async function loadUser() {
  if (tokenStorage.getToken()) {
    // const data = await getUser();
    // return data;
  }
  return null;
}

async function loginFn(credentials) {
  const response = await authenticate(credentials);
  const user = await handleUserResponse(response);
  return user;
}

async function registerFn() {
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
