import React from 'react';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import { IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import PublishIcon from '@material-ui/icons/Publish';
import Tooltip from '@material-ui/core/Tooltip';
import EditIcon from '@material-ui/icons/Edit';

const TooltipForDisabledButton = ({ title, disabled, handleClick, children }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <Tooltip title={title} open={open}>
      <div
        onMouseOver={() => setOpen(true)}
        onMouseOut={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        <IconButton disabled={disabled} onClick={() => handleClick()}>
          {children}
        </IconButton>
      </div>
    </Tooltip>
  );
};

const TooltipButton = ({ title, onClick, children }) => (
  <Tooltip title={title}>
    <IconButton onClick={onClick}>{children}</IconButton>
  </Tooltip>
);

// these pbly aren't necessary but it makes it easier to read... idk

export const TooltipCreateNewFolder = ({ title, onClick }) => (
  <TooltipButton title={title} onClick={onClick}>
    <CreateNewFolderIcon />
  </TooltipButton>
);

export const TooltipDeleteIcon = ({ title, onClick }) => (
  <TooltipButton title={title} onClick={onClick}>
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
