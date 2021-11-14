import { useRoutes } from 'react-router-dom';

const AppRoutes = () => {
  // const auth = useAuth()
  // const routes = auth.user ? protectedRoutes : publicRoutes;
  const commonRoutes = [{ path: '/', element: <div /> }];
  const routes = [{ path: '/', element: <div /> }];

  const element = useRoutes([...routes, ...commonRoutes]);
};

export default AppRoutes;
