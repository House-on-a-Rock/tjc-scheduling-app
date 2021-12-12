import { useNavigate, useLocation } from 'react-router-dom';
import { NavList } from './NavList';
import { useEffect, useState } from 'react';
import { NavigationDrawerContext } from 'providers/drawerProvider';
import { ResizeableDrawer } from 'components/drawer';

export const NavigationSidebar = ({ options }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [path, setPath] = useState('');

  function handleRoute(route) {
    setPath(route);
    navigate(route);
  }

  useEffect(() => {
    if (location.pathname !== '/') setPath(location.pathname);
  }, [location]);

  return (
    <NavigationDrawerContext.Consumer>
      {({ isOpen, setIsOpen }) => (
        <ResizeableDrawer open={isOpen} setOpen={setIsOpen}>
          {path && (
            <NavList
              options={options}
              handleRoute={handleRoute}
              path={path}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />
          )}
        </ResizeableDrawer>
      )}
    </NavigationDrawerContext.Consumer>
  );
};
