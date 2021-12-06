import { createContext, useState } from 'react';

export const DrawerProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  return (
    <NavigationDrawerContext.Provider
      value={{ isOpen: open, setIsOpen: () => setOpen(!open) }}
    >
      {children}
    </NavigationDrawerContext.Provider>
  );
};

export const NavigationDrawerContext = createContext();
