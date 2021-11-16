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
import SatelliteIcon from '@material-ui/icons/Satellite';

// these 2 can pbly be merged, didn't notice until i cleaned up the disabled one
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

export const TooltipCreateNewFolder = (props) => (
  <TooltipButton {...props}>
    <CreateNewFolderIcon />
  </TooltipButton>
);

export const TooltipDeleteIcon = (props) => (
  <TooltipButton {...props}>
    <DeleteIcon />
  </TooltipButton>
);

export const TooltipDisabledSaveIcon = (props) => (
  <TooltipForDisabledButton {...props}>
    <SaveIcon />
  </TooltipForDisabledButton>
);

export const TooltipDisabledPublishIcon = (props) => (
  <TooltipForDisabledButton {...props}>
    <PublishIcon />
  </TooltipForDisabledButton>
);

export const TooltipDisabledEditIcon = (props) => (
  <TooltipForDisabledButton {...props}>
    <EditIcon />
  </TooltipForDisabledButton>
);

export const TooltipCancelIcon = (props) => (
  <TooltipButton {...props}>
    <CancelIcon style={{ color: 'red' }} />
  </TooltipButton>
);

export const TooltipDisabledResetIcon = (props) => (
  <TooltipForDisabledButton {...props}>
    <RotateLeftIcon />
  </TooltipForDisabledButton>
);

export const TooltipDisabledSaveTemplateIcon = (props) => (
  <TooltipForDisabledButton {...props}>
    <SatelliteIcon />
  </TooltipForDisabledButton>
);

TooltipForDisabledButton.propTypes = {
  title: PropTypes.string,
  disabled: PropTypes.bool,
  handleClick: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
    .isRequired,
};
