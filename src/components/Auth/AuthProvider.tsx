import React, { useState } from 'react';
import { AuthContext } from '../../shared/services/AuthContext';

export const AuthProvider = ({ children }: any) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  // const [token, setToken] = React.useState(null);
  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        // token: token,
        login: login,
        logout: logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
