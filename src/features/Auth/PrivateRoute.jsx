import { useContext } from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import AuthContext from '../../shared/services/AuthContext';
import { extractTokenInfo, useToken } from '../../shared/utilities';

const validateUser = (condition, token) => {
  const userId = token && extractTokenInfo(token, 'userId');
  const access = token && extractTokenInfo(token, 'access');
  const exp = token && extractTokenInfo(token, 'exp');
  return token && !!userId;
};

export const PrivateRoute = ({ children, redirection, condition, ...rest }) => {
  const auth = useContext(AuthContext);
  const token = useToken();
  const isValidToken = validateUser(condition, token);
  if (!isValidToken) auth.logout();
  return (
    <Route
      {...rest}
      render={({ location }) => (isValidToken ? children : <Redirect to={redirection} />)}
    />
  );
};

PrivateRoute.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
    .isRequired,
  redirection: PropTypes.string,
  condition: PropTypes.string,
};

export default PrivateRoute;
