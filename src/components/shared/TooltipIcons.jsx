import React from 'react';
import PropTypes from 'prop-types';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import { IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import PublishIcon from '@material-ui/icons/Publish';
import Tooltip from '@material-ui/core/Tooltip';
import EditIcon from '@material-ui/icons/Edit';
import CancelIcon from '@material-ui/icons/Cancel';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';

const TooltipForDisabledButton = ({ title, disabled, handleClick, children }) => {
  return (
    <Tooltip title={title}>
      <div>
        <IconButton disabled={disabled} onClick={() => handleClick()}>
          {children}
        </IconButton>
      </div>
    </Tooltip>
  );
};

const TooltipButton = ({ title, handleClick, children }) => (
  <Tooltip title={title}>
    <IconButton onClick={handleClick}>{children}</IconButton>
  </Tooltip>
);

// these pbly aren't necessary but it makes it easier to read... idk

export const TooltipCreateNewFolder = ({ title, handleClick }) => (
  <TooltipButton title={title} handleClick={handleClick}>
    <CreateNewFolderIcon />
  </TooltipButton>
);

export const TooltipDeleteIcon = ({ title, handleClick }) => (
  <TooltipButton title={title} handleClick={handleClick}>
    <DeleteIcon />
  </TooltipButton>
);

export const TooltipDisabledSaveIcon = ({ title, disabled, handleClick }) => (
  <TooltipForDisabledButton title={title} handleClick={handleClick} disabled={disabled}>
    <SaveIcon />
  </TooltipForDisabledButton>
);

export const TooltipDisabledPublishIcon = ({ title, disabled, handleClick }) => (
  <TooltipForDisabledButton title={title} handleClick={handleClick} disabled={disabled}>
    <PublishIcon />
  </TooltipForDisabledButton>
);

export const TooltipDisabledEditIcon = ({ title, disabled, handleClick }) => (
  <TooltipForDisabledButton title={title} handleClick={handleClick} disabled={disabled}>
    <EditIcon />
  </TooltipForDisabledButton>
);

export const TooltipCancelIcon = ({ title, handleClick }) => (
  <TooltipButton title={title} handleClick={handleClick}>
    <CancelIcon style={{ color: 'red' }} />
  </TooltipButton>
);

export const TooltipDisabledResetIcon = (props) => (
  <TooltipForDisabledButton {...props}>
    <RotateLeftIcon />
  </TooltipForDisabledButton>
);

TooltipForDisabledButton.propTypes = {
  title: PropTypes.string,
  disabled: PropTypes.bool,
  handleClick: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
    .isRequired,
};
