import { useState } from 'react';
import PropTypes from 'prop-types';
import { IconButton, Tooltip } from '@material-ui/core';

const ToolbarButton = ({ title, disabled, handleClick, icon }) => {
  const [open, setOpen] = useState(false);
  return (
    <Tooltip title={title} open={open} placement="top" style={{ marginTop: '15px' }}>
      <span
        onMouseOver={() => setOpen(true)}
        onMouseOut={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        <IconButton
          disabled={disabled}
          onClick={handleClick}
          style={{ marginTop: '-15px' }}
        >
          {icon}
        </IconButton>
      </span>
    </Tooltip>
  );
};

ToolbarButton.propTypes = {
  title: PropTypes.string,
  disabled: PropTypes.bool,
  handleClick: PropTypes.func,
  icon: PropTypes.object,
};

export default ToolbarButton;
