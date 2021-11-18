import Axios from 'axios';

import { API_URL } from 'config/config';

import { tokenStorage } from 'utils/storage';

function authRequestInterceptor(config) {
  const token = tokenStorage.getToken();
  if (token) config.headers.authorization = `${token}`;

  config.headers.Accept = 'application/json';
  return config;
}

export const axios = Axios.create({ baseURL: API_URL });

axios.interceptors.request.use(authRequestInterceptor);
axios.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error),
);
