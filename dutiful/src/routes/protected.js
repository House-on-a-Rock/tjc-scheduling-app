import { Suspense } from 'react';
import { Navigate, Outlet } from 'react-router';
import { MainLayout } from 'components/layout';
import { Spinner } from 'components/loading';
import { lazyImport } from 'utils/lazyImport';

const { Templates } = lazyImport(() => import('features/templates'), 'Templates');
const { Scheduler } = lazyImport(() => import('features/scheduler'), 'Scheduler');
const { Teams } = lazyImport(() => import('features/teams'), 'Teams');
const { Users } = lazyImport(() => import('features/users'), 'Users');

const App = () => {
  return (
    <MainLayout>
      <Suspense fallback={<Spinner size="xl" />}>
        <Outlet />
      </Suspense>
    </MainLayout>
  );
};

const UserManagement = () => {
  return (
    <div>
      User Management
      <Outlet />
    </div>
  );
};

export const protectedRoutes = [
  {
    path: '*',
    element: <App />,
    children: [
      { path: 'schedule', element: <Scheduler /> },
      {
        path: 'manage',
        element: <UserManagement />,
        children: [
          { path: 'users', element: <Users /> },
          { path: 'teams', element: <Teams /> },
          { path: '*', element: <Navigate to="users" /> },
        ],
      },
      { path: 'templates', element: <Templates /> },
      { path: '*', element: <Navigate to="schedule" /> },
    ],
  },
];
