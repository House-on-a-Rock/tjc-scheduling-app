import { useEffect, useCallback, useState } from 'react';

// from here https://dev.to/rafi993/implementing-context-menu-using-react-hooks-34ke
export const useContextMenu = (outerRef: any) => {
  const [xPos, setXPos] = useState('0px');
  const [yPos, setYPos] = useState('0px');
  const [menu, showMenu] = useState(false);
  const [cellValue, setCellValue] = useState();
  const [cellRow, setCellRow] = useState();

  const handleContextMenu = useCallback(
    (event) => {
      event.preventDefault();
      if (outerRef && outerRef.current.contains(event.target)) {
        setXPos(`${event.x}px`); // x and y seem to work, pageX and pageY
        setYPos(`${event.y}px`);
        setCellValue(event.target.value);
        showMenu(true);
        const target = event.target.closest('tr');
        setCellRow(target.id);
      } else {
        showMenu(false);
      }
    },
    [showMenu, outerRef, setXPos, setYPos],
  );

  const handleClick = useCallback(() => {
    showMenu(false);
  }, [showMenu]);

  useEffect(() => {
    document.addEventListener('click', handleClick);
    document.addEventListener('contextmenu', handleContextMenu);
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  return { xPos, yPos, menu, cellValue, cellRow };
};
