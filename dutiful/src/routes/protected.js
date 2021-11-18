import { Suspense } from 'react';
import { Navigate, Outlet } from 'react-router';
import { MainLayout } from 'components/layout';
import { Spinner } from 'components/loading';
import { lazyImport } from 'utils/lazyImport';

const { Templates } = lazyImport(() => import('features/templates'), 'Templates');
const { Scheduler } = lazyImport(() => import('features/scheduler'), 'Scheduler');
const { Teams } = lazyImport(() => import('features/teams'), 'Teams');
const { Users } = lazyImport(() => import('features/users'), 'Users');
const { Profile } = lazyImport(() => import('features/users'), 'Profile');
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
      { path: 'profile', element: <Profile /> },
      { path: 'settings', element: <div>Settings</div> },
      { path: 'notifications', element: <div>Notifications</div> },
      { path: '*', element: <Navigate to="schedule" /> },
    ],
  },
];
