/* eslint-disable jsx-a11y/anchor-is-valid */
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ADMIN, TEAM_LEAD } from 'constants/permission';
import { ErrorPage } from 'features/auth';
import { useAuth } from './auth';

export const useAuthorization = () => {
  const { user } = useAuth();

  if (!user) throw Error('User does not exist!');

  const checkAccess = useCallback(
    ({ allowedRoles }) => {
      if (user.access === ADMIN) return true;
      if (allowedRoles === ADMIN) return false;
      if (user.access?.includes(TEAM_LEAD)) {
        if (allowedRoles.some((role) => user.access.includes(role))) return true;
      }
      return false;
    },
    [user.access],
  );

  return { checkAccess, role: user.role };
};

export const Authorization = ({
  policyCheck,
  allowedRoles,
  forbiddenFallback = <UnauthorizedPage />,
  children,
}) => {
  const { checkAccess } = useAuthorization();
  let canAccess = false;

  if (allowedRoles) canAccess = checkAccess({ allowedRoles });
  if (typeof policyCheck !== 'undefined') canAccess = policyCheck;

  return <>{canAccess ? children : forbiddenFallback}</>;
};

export const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <ErrorPage
      statusCode="401"
      message="Unauthorized"
      subtext={
        <p>
          You are not allowed to access this page. Please contact your administrator.
          Click
          <text style={{ color: 'blue', cursor: 'pointer' }} onClick={() => navigate(-1)}>
            here
          </text>
          to go back head over to go back.
        </p>
      }
    />
  );
};
