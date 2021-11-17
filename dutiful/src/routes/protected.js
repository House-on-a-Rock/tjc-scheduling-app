import { Suspense } from 'react';
import { Navigate, Outlet } from 'react-router';
import { MainLayout } from 'components/layout';
import { Spinner } from 'components/loading';
import { lazyImport } from 'utils/lazyImport';

const { Templates } = lazyImport(() => import('features/templates'), 'Templates');
const { Scheduler } = lazyImport(() => import('features/scheduler'), 'Scheduler');
const { Teams } = lazyImport(() => import('features/teams'), 'Teams');
const { Users } = lazyImport(() => import('features/users'), 'Users');
const { Dashboard } = lazyImport(() => import('features/dashboard'), 'Dashboard');

// TODO /manage/* doesn't renavigate to manage/

const App = () => {
  return (
    <MainLayout>
      <Suspense fallback={<Spinner size="xl" />}>
        <Outlet />
      </Suspense>
    </MainLayout>
  );
};

const UsersManagement = () => {
  return <Outlet />;
};

export const protectedRoutes = [
  {
    path: '*',
    element: <App />,
    children: [
      { path: 'schedule', element: <Scheduler /> },
      {
        path: 'manage',
        element: <UsersManagement />,
        children: [
          { path: '*', element: <Dashboard /> },
          { path: 'users', element: <Users /> },
          { path: 'teams', element: <Teams /> },
        ],
      },
      { path: 'templates', element: <Templates /> },
      { path: '*', element: <Navigate to="schedule" /> },
    ],
  },
];
