import { Navigate, useRoutes } from 'react-router-dom';
// import { useAuth } from '@/lib/auth';
// import { protectedRoutes } from './protected';
import { publicRoutes } from './public';

export const AppRoutes = () => {
  // const auth = useAuth();
  // const routes = auth.user ? protectedRoutes : publicRoutes;

  const commonRoutes = [
    { path: '/404', element: <div>404</div> },
    { path: '/*', element: <Navigate to="auth/login" /> },
  ];
  const routes = publicRoutes;
  const element = useRoutes([...routes, ...commonRoutes]);

  return <>{element}</>;
};
