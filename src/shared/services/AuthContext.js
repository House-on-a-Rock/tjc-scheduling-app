import { createContext } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});

export default AuthContext;
