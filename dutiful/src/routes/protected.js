import { Navigate } from 'react-router';

const App = () => {
  return <div>App</div>;
};

export const protectedRoutes = [
  {
    path: '/*',
    element: <App />,
    children: [{ path: '*', element: <Navigate to="." /> }],
  },
];
