import { useEffect, useRef, useState } from 'react';

export const usePortalRef = ({ ref = null, submit } = {}) => {
  const [open, setOpen] = useState(false);
  const defaultRef = useRef(null);
  const resolvedRef = ref || defaultRef;
  const prevOpen = useRef(open);

  function handleToggle(arg) {
    setOpen((prevOpen) => !prevOpen);
  }

  function handleClose(event) {
    if (resolvedRef.current && resolvedRef.current.contains(event?.target)) return;
    setOpen(false);
  }

  function handleSubmit(value) {
    return (event) => {
      submit && submit(value);
      handleClose(event);
    };
  }

  useEffect(() => {
    if (!!prevOpen.current && !open) resolvedRef.current.blur();

    prevOpen.current = open;
  }, [open]);

  return {
    open,
    anchorRef: resolvedRef,
    prevOpen,
    handleClose,
    handleSubmit,
    handleToggle,
  };
};
