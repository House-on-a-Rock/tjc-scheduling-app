import { createContext } from 'react';
import PropTypes from 'prop-types';

export const AuthContext = createContext({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});
