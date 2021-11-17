import { Suspense } from 'react';
import { Navigate, Outlet } from 'react-router';
import { MainLayout } from 'components/layout';
import { Spinner } from 'components/loading';
import { lazyImport } from 'utils/lazyImport';
import { Card, Typography } from '@material-ui/core';

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

const UsersApp = () => {
  return <Outlet />;
};

const UsersManagement = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Card>
        <Typography>Users</Typography>
      </Card>
      <Card>
        <Typography>Teams</Typography>
      </Card>
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
        element: <UsersApp />,
        children: [
          { path: '*', element: <UsersManagement /> },
          { path: 'users', element: <Users /> },
          { path: 'teams', element: <Teams /> },
        ],
      },
      { path: 'templates', element: <Templates /> },
      { path: '*', element: <Navigate to="schedule" /> },
    ],
  },
];
