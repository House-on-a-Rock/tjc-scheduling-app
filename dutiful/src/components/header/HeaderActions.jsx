import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Badge, IconButton, Tooltip } from '@material-ui/core';
import { Menu, MenuItem } from 'components/menu';
import { usePortalRef } from 'hooks';

export const HeaderAction = ({ action }) => {
  const { open, anchorRef, handleClose, handleSubmit, handleToggle } = usePortalRef();

  const baseProps = {
    link: { component: Link, to: action.url },
    menu: {
      ref: anchorRef,
      'aria-controls': open ? 'menu-list-grow' : undefined,
      'aria-haspopup': 'true',
      onClick: handleToggle,
    },
  };

  return (
    <Fragment key={`${action.key}`}>
      <Tooltip title={action.tooltip ?? ''}>
        <span>
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
        </span>
      </Tooltip>
      {action.type === 'menu' && (
        <Menu open={open} handleClose={handleClose} ref={anchorRef}>
          {action.list.map((item) => (
            <MenuItem key={item.text} onClick={handleSubmit()} {...item} />
          ))}
        </Menu>
      )}
    </Fragment>
  );
};
