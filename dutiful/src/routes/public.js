import { lazyImport } from 'utils/lazyImport';

const { AuthRoutes } = lazyImport(() => import('./auth'), 'AuthRoutes');

export const publicRoutes = [
  {
    path: '/auth/*',
    element: <AuthRoutes />,
  },
  // {
  //   path: '/temp/*',
  //   element: <TempRoutes />,
  // },
];
