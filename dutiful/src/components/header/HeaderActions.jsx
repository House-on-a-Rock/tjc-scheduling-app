import { Fragment, useEffect, useRef, useState } from 'react';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import { Menu, MenuItem } from 'components/menu';
import { Link } from 'react-router-dom';

export const HeaderAction = ({ action }) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const prevOpen = useRef(open);

  const baseProps = {
    link: {
      component: Link,
      to: action.url,
    },
    menu: {
      ref: anchorRef,
      'aria-controls': open ? 'menu-list-grow' : undefined,
      'aria-haspopup': 'true',
      onClick: handleToggle,
    },
  };

  function handleToggle() {
    setOpen((prevOpen) => !prevOpen);
  }
  function handleClose(event) {
    if (anchorRef.current && anchorRef.current.contains(event?.target)) return;
    setOpen(false);
  }
  function handleMenuItemClose(callback) {
    return () => {
      callback && callback();
      handleClose();
    };
  }

  useEffect(() => {
    if (!!prevOpen.current && !open) anchorRef.current.focus();
    prevOpen.current = open;
  }, [open]);

  return (
    <Fragment key={`${action.key}`}>
      <IconButton
        key={action.key}
        color="inherit"
        disabled={action.disabled}
        {...baseProps[action.type]}
      >
        <Badge badgeContent={action.items} color="secondary">
          {action.icon}
        </Badge>
      </IconButton>
      {action.type === 'menu' && (
        <Menu open={open} handleClose={handleClose} ref={anchorRef}>
          {action.list.map((item) => (
            <MenuItem
              key={item.text}
              onClick={handleMenuItemClose(item.onClick)}
              {...item}
            />
          ))}
        </Menu>
      )}
    </Fragment>
  );
};
