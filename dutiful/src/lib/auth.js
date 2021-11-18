import { initReactQueryAuth } from 'react-query-auth';
import { Spinner } from '@components/loading';
import { tokenStorage } from 'utils/storage';
import { extractTokenInfo } from 'utils/extractTokenInfo';
import { authenticate } from 'features/auth/api';

function checkTokenExpiration(token) {
  const expiration = extractTokenInfo(token, 'exp');
  return expiration > Date.now() / 1000;
}

async function handleUserResponse(token) {
  const user = extractTokenInfo(token, 'user');
  tokenStorage.setToken(token);
  return user;
}

async function loadUser() {
  const token = tokenStorage.getToken();
  if (token) {
    const isValidToken = checkTokenExpiration(token);
    return isValidToken && (await handleUserResponse(token));
  }
  return null;
}

async function loginFn(credentials) {
  const { token } = await authenticate(credentials);
  const user = await handleUserResponse(token);
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
    return <Spinner size="xl" />;
  },
};

export const { AuthProvider, useAuth } = initReactQueryAuth(authConfig);
