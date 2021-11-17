import { useRoutes } from 'react-router-dom';
import { useAuth } from '@lib/auth';
import { protectedRoutes } from './protected';
import { publicRoutes } from './public';

export const AppRoutes = () => {
  const auth = useAuth();

  const commonRoutes = [{ path: '/404', element: <div>404</div> }];
  const appRoutes = auth.user ? protectedRoutes : publicRoutes;
  const routes = useRoutes([...appRoutes, ...commonRoutes]);

  return <>{routes}</>;
};
