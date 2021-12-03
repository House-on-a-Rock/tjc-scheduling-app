import { useEffect, useRef, useState } from 'react';

export const useMenuRef = ({ callback = null }) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const prevOpen = useRef(open);

  function handleToggle() {
    setOpen((prevOpen) => !prevOpen);
  }
  function handleClose(event) {
    if (anchorRef.current && anchorRef.current.contains(event?.target)) return;
    setOpen(false);
  }
  function handleMenuItemClose(value) {
    return (event) => {
      callback && callback(value);
      handleClose(event);
    };
  }

  useEffect(() => {
    if (!!prevOpen.current && !open) anchorRef.current.focus();
    prevOpen.current = open;
  }, [open]);

  return { open, anchorRef, prevOpen, handleClose, handleMenuItemClose, handleToggle };
};
