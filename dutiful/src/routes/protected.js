import { Navigate } from 'react-router';

const App = () => {
  return <div>Main App Project</div>;
};

export const protectedRoutes = [
  {
    path: '/',
    element: <App />,
    children: [{ path: '*', element: <Navigate to="/" /> }],
  },
];
