import { lazy } from 'react';

const { AuthRoutes } = lazy(() => import('@routes/auth'));

export const publicRoutes = [
  // {
  //   path: '/auth/*',
  //   element: <AuthRoutes />,
  // },
  // {
  //   path: '/temp/*',
  //   element: <TempRoutes />,
  // },
];
