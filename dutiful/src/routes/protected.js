import { Suspense } from 'react';
import { Navigate, Outlet } from 'react-router';
import { MainLayout } from 'components/layout';
import { Spinner } from 'components/loading';

import { lazyImport } from 'utils/lazyImport';

const { Templates } = lazyImport(() => import('features/templates'), 'Templates');
const { Scheduler } = lazyImport(() => import('features/scheduler'), 'Scheduler');
const { Teams } = lazyImport(() => import('features/teams'), 'Teams');

const App = () => {
  return (
    <MainLayout>
      <Suspense fallback={<Spinner size="xl" />}>
        <Outlet />
      </Suspense>
    </MainLayout>
  );
};

export const protectedRoutes = [
  {
    path: '*',
    element: <App />,
    children: [
      { path: 'schedule', element: <Scheduler /> },
      { path: 'teams', element: <Teams /> },
      { path: 'templates', element: <Templates /> },
      { path: '*', element: <Navigate to="schedule" /> },
    ],
  },
];
